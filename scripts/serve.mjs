import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const collectionsOnly = process.argv.includes('--collections');
const project = path.dirname(root);
const clients = new Set();
let building = false, queued = false, buildTimer;
const rebuild = () => {
  if (building) { queued = true; return; }
  building = true;
  console.log('Rebuilding local archiveâ€¦');
  const child = spawn('python', ['scripts/build.py', ...(collectionsOnly ? ['--collections'] : [])], {cwd:project, stdio:'inherit'});
  let failed = false;
  child.on('error', error => { failed = true; console.error('Build could not start:', error.message); });
  child.on('close', code => {
    building = false;
    if (!failed && code === 0 && !queued) {
      for (const client of clients) client.write('event: reload\ndata: ready\n\n');
    } else if (code !== 0) console.error('Build failed; fix the files and save again to retry.');
    if (queued) { queued = false; rebuild(); }
  });
};
const watchers = [];
const watch = (folder, callback) => {
  const watcher = fs.watch(folder, {recursive:true}, callback);
  watcher.on('error', error => console.error('Watch error:', error.message));
  watchers.push(watcher);
};
watch(path.resolve(project, '../Work'), () => {
  clearTimeout(buildTimer);
  buildTimer = setTimeout(rebuild, 1200);
});
let reloadTimer;
watch(collectionsOnly ? root : path.join(project, 'src'), (_event, filename) => {
  // These files are build outputs; Work changes already trigger their rebuild.
  const changed = String(filename || '').replaceAll('\\', '/');
  if (!collectionsOnly && /^batch-(?:ten\/\d{2}|eleven)\/data\.json(?:\.tmp)?$/.test(changed)) return;
  if (!collectionsOnly) {
    clearTimeout(buildTimer);
    buildTimer = setTimeout(rebuild, 500);
    return;
  }
  // Encodes and data syncs write many files; reload only after the whole build.
  if (building) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    if (!building) for (const client of clients) client.write('event: reload\ndata: ready\n\n');
  }, 500);
});
const liveReload = `<script>new EventSource('/__dev/events').addEventListener('reload',()=>location.reload());</script>`;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  let relative;
  try { relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch {res.writeHead(400).end();return;}
  if (relative === '/__dev/events') {
    res.writeHead(200, {'Content-Type':'text/event-stream', 'Cache-Control':'no-cache', Connection:'keep-alive'});
    res.write(': connected\n\n');
    clients.add(res);
    const heartbeat = setInterval(() => res.write(': keepalive\n\n'), 15000);
    req.on('close', () => { clearInterval(heartbeat); clients.delete(res); });
    return;
  }
  const file = path.resolve(root, '.' + (relative.endsWith('/') ? relative + 'index.html' : relative));
  if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {res.writeHead(404).end('Not found');return;}
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
    if (path.extname(file) === '.html') {
      fs.readFile(file, 'utf8', (error, html) => {
        if (error) {res.writeHead(500).end();return;}
        const body = html.replace('</body>', `${liveReload}</body>`);
        res.writeHead(200, {...headers, 'Content-Length':Buffer.byteLength(body)});
        res.end(req.method === 'HEAD' ? undefined : body);
      });
      return;
    }
    const fingerprinted = relative.startsWith('/media/') && /-[a-f0-9]{12}(?:-preview|-loop-v1)?\.(mp4|webp)$/.test(file);
    headers['Cache-Control'] = fingerprinted ? 'public, max-age=31536000, immutable' : 'no-cache';
    const etag = `W/"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`;
    headers.ETag = etag;
    headers['Last-Modified'] = stat.mtime.toUTCString();
    if (!req.headers.range && req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers).end(); return;
    }
    let start=0,end=stat.size-1,status=200;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match) {res.writeHead(416, {'Content-Range':`bytes */${stat.size}`}).end();return;}
      if (!match[1] && match[2]) start=Math.max(0,stat.size-Number(match[2]));
      else {start=Number(match[1] || 0);end=match[2] ? Math.min(Number(match[2]),end) : end;}
      if (start>end || start>=stat.size) {res.writeHead(416, {'Content-Range':`bytes */${stat.size}`}).end();return;}
      status=206; headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(status,headers);
    if (req.method==='HEAD') {res.end();return;}
    const stream = fs.createReadStream(file,{start,end});
    res.on('close', () => stream.destroy());
    stream.on('error',()=>res.destroy()).pipe(res);
  });
});
server.on('close', () => { clearTimeout(buildTimer); watchers.forEach(watcher => watcher.close()); });
server.listen(port,'0.0.0.0',()=>{ console.log(`Local: http://127.0.0.1:${port}${collectionsOnly ? '/batch-ten/' : ''}`); rebuild(); });
