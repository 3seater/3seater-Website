import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync('src/batch-ten/app.js', 'utf8');
const navigate = source.slice(source.indexOf('  async function navigate()'), source.indexOf("  document.addEventListener('click'", source.indexOf('  async function navigate()')));
let current = {path:['project','slow'],key:'/project/slow'}, resolveImage;
const slow = new Promise(resolve => {resolveImage=resolve;});
const renders=[], animations=[];
const context = vm.createContext({
  navigationVersion:0, explicitDestination:'', arrivalAnimation:null,
  stopSmoothScroll(){}, route:()=>current, positions:new Map(),
  prepareImages:id=>id==='slow'?slow:Promise.resolve(),
  setTimeout,clearTimeout,Promise,reduced:{matches:false},
  render:()=>renders.push(current.key),
  main:{animate(frames,options){const animation={cancelled:false,cancel(){this.cancelled=true;}};animations.push({frames,options,animation});return animation;}}
});
vm.runInContext(navigate,context);
const old=context.navigate();
assert.deepEqual(renders,['/project/slow'],'A cold image must not delay the route commit');
current={path:['archive'],key:'/archive'};
await context.navigate();resolveImage();await old;
assert.deepEqual(renders,['/project/slow','/archive'],'Image decoding never blocks a route; newer navigation commits immediately');
assert.equal(animations.length,2);
assert.ok(animations[0].frames[0].opacity>0,'Transition never fades through a blank page');
current={path:['index'],key:'/index'};await context.navigate();
assert.equal(animations[0].animation.cancelled,true,'Rapid navigation cancels the previous animation');
context.reduced.matches=true;current={path:[],key:'/'};await context.navigate();
assert.equal(animations.length,3,'Reduced motion skips the animation');
assert.deepEqual(renders,['/project/slow','/archive','/index','/']);
const playback=source.slice(source.indexOf('  function updatePlayback()'),source.indexOf('  function renderFeed('));
let calls=0, resolvePlay;
const classes=new Set();
const video={src:'video.mp4',readyState:4,paused:true,isConnected:true,dataset:{},closest:()=>null,
 classList:{contains:x=>classes.has(x),add:x=>classes.add(x)},
 play(){calls++;return new Promise(resolve=>{resolvePlay=()=>{video.paused=false;resolve();};});},pause(){video.paused=true;}};
Object.assign(context,{document:{hidden:false},navigator:{},visibleVideos:new Set([video]),pendingPlayback:new WeakSet()});
context.reduced.matches=false;vm.runInContext(playback,context);
context.updatePlayback();context.updatePlayback();assert.equal(calls,1,'Concurrent intersection events share one play request');
resolvePlay();await new Promise(resolve=>setImmediate(resolve));
context.updatePlayback();assert.equal(calls,1,'Playing video is not repeatedly restarted');assert.equal(classes.has('playing'),true);
console.log('PASS: immediate route commit, rapid clicks, nonblank transition, reduced motion, deduplicated media playback.');
const startupOrder=[];
video.src='';video.paused=true;video.dataset.preview='full-loop.mp4';classes.clear();
video.load=()=>{startupOrder.push('load');video.readyState=0;};
video.play=()=>{startupOrder.push('play');video.paused=false;return Promise.resolve();};
context.updatePlayback();
assert.deepEqual(startupOrder,['load'],'Do not call play until canplay readiness');
assert.equal(video.dataset.playbackState,'loading');
video.readyState=3;context.updatePlayback();await new Promise(resolve=>setImmediate(resolve));
assert.deepEqual(startupOrder,['load','play']);assert.equal(video.preload,'auto');assert.equal(video.muted,true);assert.equal(video.defaultMuted,true);assert.equal(classes.has('playing'),true);
console.log('PASS: first visible source explicitly loads muted and reveals without a frame callback.');

// Small-card selection must not downgrade larger project media.
video.src='';video.paused=true;video.dataset.previewSmall='small-loop.mp4';
video.getBoundingClientRect=()=>({width:240});
context.updatePlayback();assert.equal(video.src,'small-loop.mp4');
video.src='';video.getBoundingClientRect=()=>({width:640});
context.updatePlayback();assert.equal(video.src,'full-loop.mp4');
console.log('PASS: small tiles select the lightweight loop; large media retains its source.');

const clickSource=source.slice(source.indexOf("  document.addEventListener('click'",source.indexOf('  async function navigate()')),source.indexOf("  for (const eventName",source.indexOf('  async function navigate()')));
let clickHandler, commits=0, prevented=0, pushed='';
const clickContext=vm.createContext({document:{addEventListener:(type,fn)=>{clickHandler=fn;}},
 explicitDestination:'',route:()=>({key:'/'}),history:{pushState:(state,title,url)=>{pushed=url;}},navigate:()=>{commits++;},window:{scrollTo(){}}});
vm.runInContext(clickSource,clickContext);
const navLink={hash:'#/archive',target:'',hasAttribute:()=>false,matches:()=>true};
const event={button:0,target:{closest:()=>navLink},preventDefault:()=>{prevented++;}};
clickHandler(event);assert.equal(prevented,1);assert.equal(pushed,'#/archive');assert.equal(commits,1,'Click commits synchronously without waiting for hashchange');
clickHandler({...event,ctrlKey:true});assert.equal(commits,1,'Modified clicks preserve native new-tab behavior');
console.log('PASS: direct click navigation and modified-link behavior.');

context.reduced.matches=false;current={path:['archive'],key:'/archive'};
context.explicitDestination='/archive';const beforeNavAnimations=animations.length;
await context.navigate();assert.equal(renders.at(-1),'/archive');
assert.equal(animations.length,beforeNavAnimations,'Header navigation must commit without an arrival fade');
console.log('PASS: header navigation switches immediately without a fade.');

const cacheSource=source.slice(source.indexOf('  const videoCache = []'),source.indexOf('  function cleanup()'));
const cacheContext=vm.createContext({});vm.runInContext(cacheSource,cacheContext);
let releases=0;
function mockPlayer(id){const attrs=new Map([['src',id]]);return {dataset:{preview:id},paused:false,readyState:4,currentTime:7.25,muted:false,classList:{contains:()=>true},hasAttribute:n=>attrs.has(n),getAttribute:n=>attrs.get(n),setAttribute:(n,v)=>attrs.set(n,v),removeAttribute:n=>attrs.delete(n),pause(){this.paused=true;},remove(){},load(){releases++;}};}
const retained=mockPlayer('clip.mp4');cacheContext.retainVideoPlayers({querySelectorAll:()=>[retained]});
let restored;const placeholder={dataset:{preview:'clip.mp4'},hasAttribute:()=>false,replaceWith:v=>{restored=v;}};
cacheContext.restoreVideoPlayers({querySelectorAll:()=>[placeholder]});
assert.equal(restored,retained,'Reuse the actual decoded element, not a new source');
assert.equal(restored.currentTime,7.25);assert.equal(releases,0);assert.equal(restored.paused,true);
cacheContext.retainVideoPlayers({querySelectorAll:()=>Array.from({length:25},(_,i)=>mockPlayer('clip-'+i))});
assert.equal(vm.runInContext('videoCache.length',cacheContext),24);assert.equal(releases,1,'Evict the oldest retained decoder at the limit');
console.log('PASS: decoded-player reuse preserves time, pauses off-page, and bounds the cache.');
