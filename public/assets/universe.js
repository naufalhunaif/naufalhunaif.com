// All artwork is sampled into circles drawn by Canvas. No image asset is loaded.
const SCENES = [
  {name:'Wajah manusia', draw:face},
  {name:'Galaksi spiral', draw:galaxy},
  {name:'Kuda berlari', draw:horse},
  {name:'Pohon dan akar', draw:tree},
  {name:'Sosok manusia', draw:human},
  {name:'Planet bercincin', draw:planet},
  {name:'Bunga', draw:flower},
  {name:'Burung terbang', draw:bird},
  {name:'Pegunungan', draw:mountains},
  {name:'Bentuk abstrak', draw:abstract}
];
const canvases = [...document.querySelectorAll('.artwork-canvas')];
const dotsContainer = document.querySelector('.progress-dots');
const pauseButton = document.querySelector('[data-pause]');
const pauseIcon = pauseButton.querySelector('[data-dot-icon]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mask = document.createElement('canvas');
const S = 640;
mask.width = mask.height = S;
const ink = mask.getContext('2d', {willReadFrequently:true});
let current = 0, visibleLayer = 0, paused = reduceMotion.matches;
let timer, motionTimer, motionPhase = 0, touchStartX = null;
const indicators = SCENES.map((scene, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `progress-dot${index === 0 ? ' is-active' : ''}`;
  button.setAttribute('aria-label', scene.name);
  button.setAttribute('aria-pressed', String(index === 0));
  button.addEventListener('click', () => show(index));
  dotsContainer.append(button);
  return button;
});
function hash(a,b,seed=0) {
  let n = Math.imul(a+1031,374761393)+Math.imul(b+917,668265263)+Math.imul(seed+1,1442695041);
  n = Math.imul(n^(n>>>13),1274126177);
  return ((n^(n>>>16))>>>0)/4294967295;
}
function gauss(x,y,cx,cy,sx,sy) {const dx=(x-cx)/sx,dy=(y-cy)/sy;return Math.exp(-.5*(dx*dx+dy*dy));}
function clearMask() {ink.fillStyle='#000';ink.fillRect(0,0,S,S);}
function face(phase=0) { window.drawAnatomy(ink,S,'head',phase); }
function galaxy() {
  clearMask();const image=ink.createImageData(S,S),data=image.data;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const dx=x-320,dy=(y-310)*1.04,r=Math.hypot(dx,dy),spin=Math.atan2(dy,dx)-r*.023;
    const arm=Math.pow(Math.max(0,Math.cos(spin*2)),7),arm2=Math.pow(Math.max(0,Math.cos(spin*2+.67)),10);
    const core=252*Math.exp(-r*r/(2*53*53)),disk=Math.exp(-r/220);
    const cloud=.62+.25*Math.sin(x*.068+y*.037)*Math.sin(y*.054-x*.027);
    const v=Math.min(255,core+(175*arm+80*arm2+13)*disk*cloud),p=(y*S+x)*4;
    data[p]=data[p+1]=data[p+2]=v;data[p+3]=255;
  }
  ink.putImageData(image,0,0);
}
function horse(phase=0) { window.drawAnatomy(ink,S,'horse',phase); }
function tree(phase=0) { window.drawAnatomy(ink,S,'tree',phase); }
function human(phase=0) { window.drawAnatomy(ink,S,'human',phase); }
function planet() {
  const image=ink.createImageData(S,S),data=image.data;
  const center=S*.5,radius=S*.24,tilt=-.30,c=Math.cos(tilt),sn=Math.sin(tilt);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const dx=x-center,dy=y-center,rx=dx*c+dy*sn,ry=-dx*sn+dy*c;
    const diskRadius=Math.hypot(rx,ry/.33),diskZ=ry/.33*.944;
    const sphereR=dx*dx+dy*dy;
    let value=0,sphereZ=-Infinity;
    if(sphereR<radius*radius){
      sphereZ=Math.sqrt(radius*radius-sphereR);
      const diffuse=Math.max(0,(-dx*.48-dy*.55+sphereZ*.68)/radius);
      const bands=.77+.075*Math.sin(ry*.095+Math.sin(rx*.025)*.8)+.045*Math.sin(ry*.31);
      value=(.06+.96*diffuse)*bands;
    }
    if(diskRadius>radius*1.34&&diskRadius<radius*1.87&&diskZ>sphereZ){
      value=.47+.11*Math.sin(diskRadius*1.4)+.09*Math.sin(diskRadius*.41);
      if(diskRadius>radius*1.63&&diskRadius<radius*1.68)value*=.12;
      value*=.6+.4*(rx+S*.5)/S;
    }
    const p=(y*S+x)*4,v=Math.min(255,value*255);
    data[p]=data[p+1]=data[p+2]=v;data[p+3]=255;
  }
  ink.putImageData(image,0,0);
}
function flower(phase=0) { window.drawAnatomy(ink,S,'flower',phase); }
function bird(phase=0) { window.drawAnatomy(ink,S,'bird',phase); }
function mountains(phase=0) { window.drawAnatomy(ink,S,'mountains',phase); }
function abstract() {
  clearMask();const image=ink.createImageData(S,S),data=image.data;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const wave=85*Math.sin(x*.019+Math.sin(y*.012)*2.2),fold=80*Math.cos(y*.023-x*.01);
    const cloud=145*gauss(x,y,180,188,164,120)+155*gauss(x,y,490,440,146,160);
    const void1=245*gauss(x,y,280,360,115,150),void2=170*gauss(x,y,506,157,98,115);
    const v=Math.max(0,Math.min(255,60+wave+fold+cloud-void1-void2)),p=(y*S+x)*4;
    data[p]=data[p+1]=data[p+2]=v;data[p+3]=255;
  }
  ink.putImageData(image,0,0);
}
function render(canvas,sceneIndex,phase=0) {
  const width=canvas.clientWidth,height=canvas.clientHeight;
  if(!width||!height)return;
  // A high-DPI backing store keeps every procedural dot sharp on Retina displays.
  const dpr=Math.max(1,Math.min(devicePixelRatio||1,3,4096/Math.max(width,height)));
  SCENES[sceneIndex].draw(phase);
  const pixels=ink.getImageData(0,0,S,S).data,mobile=width<700;
  const size=Math.min(width*(mobile?1.2:.91),height*(mobile?.82:.93),1060);
  const left=(width-size)/2,top=(height-size)/2-(mobile?14:2);
  const pitch=mobile?2.3:3.0,columns=Math.ceil(width/pitch),rows=Math.ceil(height/pitch);
  const dots=[];
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
    const x=(col+.5)*pitch,y=(row+.5)*pitch,mx=Math.floor((x-left)/size*S),my=Math.floor((y-top)/size*S);
    let light=mx>=0&&mx<S&&my>=0&&my<S?pixels[(my*S+mx)*4]/255:0;
    const grain=hash(col,row,sceneIndex);
    if(SCENES[sceneIndex].draw===galaxy){
      if(grain>.995)light=Math.max(light,.32+hash(row,col,7)*.5);
      else if(grain>.9)light*=.4+grain*.5;
    } else if(grain>.9985)light=Math.max(light,.15);
    if(light<.055||grain<.08*(1-light))continue;
    const radius=pitch*(.055+.33*Math.pow(light,.76)),alpha=Math.min(1,.22+light*.87);
    dots.push(x,y,radius,alpha);
  }
  window.drawNativeDots(canvas,width,height,dpr,dots);
}
function schedule() {clearTimeout(timer);if(!paused&&!document.hidden)timer=setTimeout(()=>show(current+1),7200);}
function animateSubject() {
  clearInterval(motionTimer);
  let last=performance.now();
  if((current===2||current===7)&&!paused&&!document.hidden)motionTimer=setInterval(()=>{
    const now=performance.now();motionPhase+=Math.min(180,now-last)*.0125;last=now;
    render(canvases[visibleLayer],current,motionPhase);
  },85);
}
function setPauseState() {
  pauseButton.setAttribute('aria-label',paused?'Lanjutkan animasi':'Jeda animasi');
  window.drawDotIcon(pauseIcon,paused?'play':'pause');schedule();animateSubject();
}
function show(index) {
  index=(index+SCENES.length)%SCENES.length;
  if(index===current){schedule();return;}
  const incomingIndex=1-visibleLayer,incoming=canvases[incomingIndex],outgoing=canvases[visibleLayer];
  render(incoming,index);
  incoming.setAttribute('aria-label',SCENES[index].name);
  requestAnimationFrame(()=>{
    outgoing.classList.remove('is-visible');outgoing.setAttribute('aria-hidden','true');
    incoming.classList.add('is-visible');incoming.removeAttribute('aria-hidden');
    visibleLayer=incomingIndex;current=index;
    indicators.forEach((dot,i)=>{dot.classList.toggle('is-active',i===current);dot.setAttribute('aria-pressed',String(i===current));});
    schedule();animateSubject();
  });
}
function next(){show(current+1);}function previous(){show(current-1);}
document.querySelector('[data-next]').addEventListener('click',next);
document.querySelector('[data-prev]').addEventListener('click',previous);
document.querySelector('[data-random]').addEventListener('click',()=>show(current+1+Math.floor(Math.random()*(SCENES.length-1))));
pauseButton.addEventListener('click',()=>{paused=!paused;setPauseState();});
document.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'){event.preventDefault();next();}
  else if(event.key==='ArrowLeft'){event.preventDefault();previous();}
  else if(event.code==='Space'&&event.target===document.body){event.preventDefault();paused=!paused;setPauseState();}
});
document.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0]?.screenX??null;},{passive:true});
document.addEventListener('touchend',event=>{
  if(touchStartX===null)return;
  const dx=(event.changedTouches[0]?.screenX??touchStartX)-touchStartX;touchStartX=null;
  if(Math.abs(dx)>55)(dx<0?next:previous)();
},{passive:true});
document.addEventListener('visibilitychange',()=>{schedule();animateSubject();});
reduceMotion.addEventListener('change',()=>{paused=reduceMotion.matches;setPauseState();});
let resizeTimer;
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>render(canvases[visibleLayer],current,motionPhase),130);});
render(canvases[0],0);setPauseState();
