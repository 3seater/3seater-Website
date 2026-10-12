import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  let relative;
  try { relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch {res.writeHead(400).end();return;}
  const file = path.resolve(root, '.' + (relative === '/' ? '/index.html' : relative));
  if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {res.writeHead(404).end('Not found');return;}
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
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
    fs.createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
  });
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}`));
