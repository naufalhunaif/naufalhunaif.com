// All artwork is sampled into circles drawn by Canvas. No image asset is loaded.
const SCENES = [
  {name:'Galaksi spiral', draw:galaxy},
  {name:'Wajah manusia', draw:face},
  {name:'Kuda berlari', draw:horse},
  {name:'Pohon dan akar', draw:tree},
  {name:'Sosok manusia', draw:human},
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
let timer, horseTimer, horsePhase = 0, touchStartX = null;
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
function ellipse(x,y,rx,ry,fill,rotation=0) {ink.beginPath();ink.ellipse(x,y,rx,ry,rotation,0,Math.PI*2);ink.fillStyle=fill;ink.fill();}
function shape(points,fill) {ink.beginPath();ink.moveTo(...points[0]);for(let i=1;i<points.length;i++)ink.lineTo(...points[i]);ink.closePath();ink.fillStyle=fill;ink.fill();}
function stroke(points,width,color='#ddd') {ink.beginPath();ink.moveTo(...points[0]);for(let i=1;i<points.length;i++)ink.lineTo(...points[i]);ink.lineWidth=width;ink.lineCap=ink.lineJoin='round';ink.strokeStyle=color;ink.stroke();}
function radial(x,y,r,inner=245,outer=0) {const g=ink.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgb(${inner} ${inner} ${inner})`);g.addColorStop(1,`rgb(${outer} ${outer} ${outer})`);return g;}
function clearMask() {ink.fillStyle='#000';ink.fillRect(0,0,S,S);}
function face() {
  clearMask();
  ellipse(320,612,221,147,radial(320,540,310,110,0));
  ellipse(320,315,186,254,radial(279,245,300,185,0));
  ellipse(312,295,146,213,radial(283,263,250,225,22));
  ellipse(195,330,23,63,radial(192,316,76,145,0));
  ellipse(445,330,23,63,radial(445,316,76,135,0));
  ellipse(317,158,171,102,radial(300,145,205,170,0));
  ellipse(320,115,137,70,'#090909');
  ellipse(223,145,43,101,'#171717',-.4);
  ellipse(425,145,43,105,'#171717',.4);
  ellipse(253,285,63,24,radial(253,285,84,100,0));
  ellipse(387,285,63,24,radial(387,285,84,100,0));
  ellipse(253,287,46,13,'#050505');ellipse(387,287,46,13,'#050505');
  ellipse(253,286,12,12,'#686868');ellipse(387,286,12,12,'#686868');
  ellipse(257,283,4,4,'#fff');ellipse(391,283,4,4,'#fff');
  stroke([[212,249],[247,238],[285,247]],10,'#101010');
  stroke([[354,247],[391,238],[428,249]],10,'#101010');
  ellipse(320,338,23,90,radial(306,329,98,235,15));
  ellipse(320,398,49,18,radial(314,387,55,85,0));
  ellipse(302,407,16,8,'#0b0b0b');ellipse(340,407,16,8,'#0b0b0b');
  ellipse(320,462,64,12,'#080808');
  ellipse(320,451,61,11,radial(315,449,65,150,0));
  ellipse(320,477,61,8,radial(320,475,68,120,0));
  ellipse(315,507,55,24,radial(310,507,65,150,0));
  for(let y=110;y<595;y+=13){const j=hash(y,4);ink.fillStyle=`rgba(0,0,0,${.13+j*.17})`;ink.fillRect(135+j*27,y,370-j*57,1+j*2);}
}
function galaxy() {
  clearMask();const image=ink.createImageData(S,S),data=image.data;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const dx=x-320,dy=(y-310)*1.04,r=Math.hypot(dx,dy),spin=Math.atan2(dy,dx)-r*.023;
    const arm=Math.pow(Math.max(0,Math.cos(spin*2)),7),arm2=Math.pow(Math.max(0,Math.cos(spin*2+.67)),10);
    const core=252*Math.exp(-r*r/(2*53*53)),disk=Math.exp(-r/220);
    const cloud=.62+.25*Math.sin(x*.068+y*.037)*Math.sin(y*.054-x*.027);
    const v=Math.min(255,core+(115*arm+55*arm2+15)*disk*cloud),p=(y*S+x)*4;
    data[p]=data[p+1]=data[p+2]=v;data[p+3]=255;
  }
  ink.putImageData(image,0,0);ellipse(319,310,61,51,radial(319,310,73,255,0));
}
function horse(phase=0) {
  clearMask();const kick=Math.sin(phase),reach=Math.cos(phase),white='#dedede',mid='#969696';
  for(let i=0;i<25;i++)ellipse(60+hash(i,7)*130,365+hash(i,8)*130,1+hash(i,9)*3,1+hash(i,10)*3,'#505050');
  stroke([[197,320],[124,280+kick*16],[75,250+kick*23]],28,mid);
  stroke([[175,327],[107,315+kick*18],[60,333+kick*28]],15,white);
  ellipse(315,320,162,80,radial(300,282,190,230,78),-.09);
  ellipse(212,339,68,66,radial(195,317,90,210,40));
  shape([[395,293],[435,225],[490,192],[508,215],[475,294],[434,348]],white);
  ellipse(445,265,43,82,radial(445,240,96,225,48),.49);
  shape([[473,193],[530,166],[556,181],[557,216],[523,240],[489,225]],white);
  shape([[520,212],[588,215],[599,236],[560,248],[524,236]],mid);
  shape([[487,184],[484,142],[502,162],[507,186]],white);
  shape([[514,174],[522,140],[534,168]],mid);
  stroke([[458,233],[420,184],[388,182],[401,223]],18,'#bebebe');
  ellipse(535,191,4,4,'#080808');ellipse(573,228,4,3,'#111');
  stroke([[229,368],[179+kick*48,421],[124+kick*74,449-kick*30]],25,mid);
  stroke([[255,376],[205-kick*60,422],[156-kick*87,465+kick*32]],22,white);
  stroke([[394,363],[443+reach*39,410],[493+reach*67,429-reach*31]],25,mid);
  stroke([[415,358],[462-reach*31,418],[532-reach*63,463+reach*25]],21,white);
  stroke([[114+kick*74,450-kick*30],[84+kick*80,451-kick*30]],11,white);
  stroke([[146-kick*87,465+kick*32],[116-kick*87,466+kick*32]],10,mid);
  stroke([[488+reach*67,429-reach*31],[519+reach*69,430-reach*31]],10,white);
  stroke([[528-reach*63,463+reach*25],[558-reach*63,463+reach*25]],10,mid);
}
function branch(x,y,length,angle,width,depth,seed,root=false) {
  if(depth<=0||length<5)return;
  const nx=x+Math.cos(angle)*length,ny=y+Math.sin(angle)*length;
  stroke([[x,y],[nx,ny]],width,depth<3?'#bfbfbf':'#e5e5e5');
  if(depth===1&&!root)ellipse(nx,ny,3,3,'#e9e9e9');
  const bend=.24+hash(depth,seed)*.24;
  branch(nx,ny,length*(.72+hash(seed,depth)*.08),angle-bend,width*.68,depth-1,seed+3,root);
  branch(nx,ny,length*(.67+hash(seed,depth+1)*.08),angle+bend,width*.65,depth-1,seed+7,root);
  if(depth>3&&hash(depth,seed+8)>.36)branch(nx,ny,length*.54,angle+(hash(seed,depth+4)-.5)*.32,width*.49,depth-2,seed+11,root);
}
function tree() {
  clearMask();const trunk=ink.createLinearGradient(284,0,360,0);
  trunk.addColorStop(0,'#676767');trunk.addColorStop(.5,'#fff');trunk.addColorStop(1,'#797979');
  shape([[295,414],[292,242],[305,210],[326,212],[349,260],[345,414],[332,455],[311,449]],trunk);
  branch(311,262,100,-1.96,21,6,1);branch(331,262,100,-1.15,20,6,2);
  branch(318,218,96,-Math.PI/2,16,6,3);
  branch(306,413,101,2.12,18,6,8,true);branch(328,413,101,1.04,17,6,9,true);
  branch(318,425,102,Math.PI/2,14,6,12,true);
  stroke([[80,414],[560,414]],2,'#444');
}
function human() {
  clearMask();
  ellipse(320,150,55,69,radial(304,122,108,222,62));
  ellipse(320,102,52,32,'#202020');
  ellipse(278,152,9,23,'#777');ellipse(362,152,9,23,'#777');
  shape([[288,195],[352,195],[391,249],[373,417],[354,453],[282,453],[265,418],[250,249]],radial(294,241,249,225,35));
  shape([[277,221],[238,240],[198,384],[212,400],[241,394],[284,289]],'#b5b5b5');
  shape([[358,221],[399,244],[445,381],[427,401],[402,395],[351,286]],'#999');
  ellipse(212,405,15,20,'#d6d6d6');ellipse(426,405,15,20,'#d6d6d6');
  shape([[289,427],[318,428],[307,569],[284,572],[269,555]],'#d1d1d1');
  shape([[324,428],[353,427],[371,556],[355,571],[331,568]],'#a3a3a3');
  ellipse(288,578,37,13,'#ddd',-.1);ellipse(358,578,37,13,'#aaa',.1);
  stroke([[320,212],[321,418]],3,'#343434');
}
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
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  const ctx=canvas.getContext('2d',{alpha:false});ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);
  SCENES[sceneIndex].draw(phase);
  const pixels=ink.getImageData(0,0,S,S).data,mobile=width<700;
  const size=Math.min(width*(mobile?1.2:.91),height*(mobile?.82:.93),1060);
  const left=(width-size)/2,top=(height-size)/2-(mobile?14:2);
  const pitch=mobile?4.2:5.1,columns=Math.ceil(width/pitch),rows=Math.ceil(height/pitch);
  const dotBands=Array.from({length:8},()=>[]);
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
    const x=(col+.5)*pitch,y=(row+.5)*pitch,mx=Math.floor((x-left)/size*S),my=Math.floor((y-top)/size*S);
    let light=mx>=0&&mx<S&&my>=0&&my<S?pixels[(my*S+mx)*4]/255:0;
    const grain=hash(col,row,sceneIndex);
    if(sceneIndex===0){
      if(grain>.995)light=Math.max(light,.32+hash(row,col,7)*.5);
      else if(grain>.9)light*=.4+grain*.5;
    } else if(grain>.9985)light=Math.max(light,.15);
    if(light<.055||grain<.08*(1-light))continue;
    const radius=pitch*(.055+.33*Math.pow(light,.76)),alpha=Math.min(1,.22+light*.87);
    dotBands[Math.min(7,Math.floor(alpha*8))].push([x,y,radius]);
  }
  for(let band=0;band<8;band++){
    ctx.beginPath();
    for(const [x,y,radius] of dotBands[band]){
      ctx.moveTo(x+radius,y);ctx.arc(x,y,radius,0,Math.PI*2);
    }
    ctx.fillStyle=`rgba(255,255,255,${(band+.5)/8})`;ctx.fill();
  }
}
function schedule() {clearTimeout(timer);if(!paused&&!document.hidden)timer=setTimeout(()=>show(current+1),7200);}
function animateHorse() {
  clearInterval(horseTimer);
  if(current===2&&!paused&&!document.hidden)horseTimer=setInterval(()=>{
    horsePhase+=.42;render(canvases[visibleLayer],current,horsePhase);
  },140);
}
function setPauseState() {
  pauseButton.setAttribute('aria-label',paused?'Lanjutkan animasi':'Jeda animasi');
  window.drawDotIcon(pauseIcon,paused?'play':'pause');schedule();animateHorse();
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
    schedule();animateHorse();
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
document.addEventListener('visibilitychange',()=>{schedule();animateHorse();});
reduceMotion.addEventListener('change',()=>{paused=reduceMotion.matches;setPauseState();});
let resizeTimer;
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>render(canvases[visibleLayer],current,horsePhase),130);});
render(canvases[0],0);setPauseState();
