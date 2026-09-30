const SCENES=[
  {src:"/assets/dot-horse.png",alt:"Kuda berlari tersusun dari ribuan titik putih",kind:"portrait"},
  {src:"/assets/dot-roots.png",alt:"Pohon dengan akar bercabang tersusun dari titik putih",kind:"portrait"},
  {src:"/assets/dot-galaxy.png",alt:"Galaksi spiral tersusun dari titik-titik cahaya",kind:"portrait"},
  {src:"/assets/dot-human.png",alt:"Sosok manusia menatap langit berbintang dalam seni dot",kind:"portrait"},
  {src:"/assets/dot-portrait.jpeg",alt:"Wajah artistik tersusun dari titik putih pada latar hitam",kind:"face"},
  {src:"/assets/dot-abstract.jpeg",alt:"Komposisi abstrak dari titik hitam dan putih",kind:"wide"}
];
const layers=[...document.querySelectorAll(".artwork-image")];
const dotsContainer=document.querySelector(".progress-dots");
const pauseButton=document.querySelector("[data-pause]");
const pauseIcon=pauseButton.querySelector("[data-dot-icon]");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
const INTERVAL=6700;
let current=0,visibleLayer=0,timer=null,paused=reduceMotion.matches,transitionId=0,touchStartX=null;
const indicators=SCENES.map((scene,index)=>{
  const button=document.createElement("button");button.type="button";button.className="progress-dot"+(index===0?" is-active":"");button.setAttribute("aria-label",`Tampilkan visual ${scene.alt}`);button.setAttribute("aria-pressed",index===0?"true":"false");button.addEventListener("click",()=>show(index));dotsContainer.appendChild(button);return button;
});
function schedule(){
  clearTimeout(timer);timer=null;
  if(!paused&&!document.hidden)timer=setTimeout(()=>show((current+1)%SCENES.length),INTERVAL);
}
function preloadNext(){const img=new Image();img.src=SCENES[(current+1)%SCENES.length].src;}
function setPauseState(){pauseButton.setAttribute("aria-label",paused?"Lanjutkan animasi":"Jeda animasi");window.drawDotIcon(pauseIcon,paused?"play":"pause");schedule();}
async function show(index){
  index=(index+SCENES.length)%SCENES.length;
  if(index===current){schedule();return;}
  const token=++transitionId,scene=SCENES[index],incoming=layers[1-visibleLayer],outgoing=layers[visibleLayer];
  incoming.className="artwork-image"+(scene.kind==="wide"?" is-wide":scene.kind==="face"?" is-face":"");
  incoming.alt=scene.alt;incoming.setAttribute("aria-hidden","true");incoming.src=scene.src;
  try{await incoming.decode();}catch{if(!incoming.complete||!incoming.naturalWidth)return;}
  if(token!==transitionId)return;
  requestAnimationFrame(()=>{
    if(token!==transitionId)return;
    outgoing.classList.remove("is-visible");outgoing.setAttribute("aria-hidden","true");outgoing.alt="";
    incoming.classList.add("is-visible");incoming.removeAttribute("aria-hidden");
    visibleLayer=1-visibleLayer;current=index;
    indicators.forEach((dot,i)=>{dot.classList.toggle("is-active",i===current);dot.setAttribute("aria-pressed",i===current?"true":"false");});
    schedule();preloadNext();
  });
}
function next(){show(current+1)}function previous(){show(current-1)}
document.querySelector("[data-next]").addEventListener("click",next);
document.querySelector("[data-prev]").addEventListener("click",previous);
document.querySelector("[data-random]").addEventListener("click",()=>show((current+1+Math.floor(Math.random()*(SCENES.length-1)))%SCENES.length));
pauseButton.addEventListener("click",()=>{paused=!paused;setPauseState();});
document.addEventListener("keydown",event=>{
  if(event.key==="ArrowRight"){event.preventDefault();next();}
  else if(event.key==="ArrowLeft"){event.preventDefault();previous();}
  else if(event.code==="Space"&&event.target===document.body){event.preventDefault();paused=!paused;setPauseState();}
});
document.addEventListener("touchstart",event=>{touchStartX=event.changedTouches[0]?.screenX??null;},{passive:true});
document.addEventListener("touchend",event=>{if(touchStartX===null)return;const dx=(event.changedTouches[0]?.screenX??touchStartX)-touchStartX;touchStartX=null;if(Math.abs(dx)>55)(dx<0?next:previous)();},{passive:true});
document.addEventListener("visibilitychange",schedule);
reduceMotion.addEventListener("change",()=>{paused=reduceMotion.matches;setPauseState();});
setPauseState();preloadNext();
