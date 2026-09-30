const canvas=document.querySelector(".universe-canvas");
if(canvas){
  const ctx=canvas.getContext("2d",{alpha:false});
  const source=document.createElement("canvas");source.width=320;source.height=420;
  const s=source.getContext("2d",{willReadFrequently:true});
  const scenes=["WAJAH","KUDA BERLARI","MANUSIA","TUMBUHAN & AKAR","GALAKSI","PLANET","BURUNG","IKAN","KUPU-KUPU","PEGUNUNGAN","NEBULA","ABSTRAK"];
  const assets={face:new Image(),abstract:new Image()};
  assets.face.src="/assets/dot-portrait.jpeg";
  assets.abstract.src="/assets/dot-abstract.jpeg";
  const label=document.querySelector("[data-scene-name]");
  const count=document.querySelector("[data-scene-count]");
  const next=document.querySelector(".visual-next");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let index=0,start=performance.now(),last=0,width=0,height=0,dpr=1;
  const hash=(x,y,seed=0)=>{let n=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return n-Math.floor(n)};
  function updateLabels(){
    const n=String(index+1).padStart(2,"0"),value=`${scenes[index]} / ${n}`;
    label.dataset.originalText=value;count.dataset.originalText=`${n} / ${String(scenes.length).padStart(2,"0")}`;
    window.dotMatrixRender?.(label);window.dotMatrixRender?.(count);
    canvas.setAttribute("aria-label",`Visual titik: ${scenes[index].toLowerCase()}`);
  }
  function choose(i){index=(i+scenes.length)%scenes.length;start=performance.now();updateLabels();draw(start);}
  next?.addEventListener("click",()=>choose(index+1));
  function resize(){
    const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);
    dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now());
  }
  new ResizeObserver(resize).observe(canvas);
  function cover(img){
    if(!img.complete||!img.naturalWidth)return false;
    const scale=Math.max(320/img.naturalWidth,420/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
    s.save();s.filter="grayscale(1) contrast(1.7) brightness(1.1) blur(.6px)";
    s.drawImage(img,(320-w)/2,(420-h)/2,w,h);s.restore();return true;
  }
  function limb(ax,ay,bx,by,cx,cy,thick){s.lineWidth=thick;s.beginPath();s.moveTo(ax,ay);s.lineTo(bx,by);s.lineTo(cx,cy);s.stroke();}
  function drawHorse(t){
    const gait=Math.sin(t*.008),gait2=Math.sin(t*.008+Math.PI);
    s.fillStyle="#fff";s.strokeStyle="#fff";s.lineCap="round";s.lineJoin="round";
    s.beginPath();s.ellipse(151,225,82,35,-.08,0,Math.PI*2);s.fill();
    s.beginPath();s.moveTo(199,209);s.lineTo(230,155);s.lineTo(248,160);s.lineTo(235,228);s.closePath();s.fill();
    s.beginPath();s.ellipse(259,157,31,16,.22,0,Math.PI*2);s.fill();
    s.beginPath();s.moveTo(247,144);s.lineTo(248,127);s.lineTo(258,145);s.moveTo(264,142);s.lineTo(270,128);s.lineTo(273,145);s.fill();
    s.lineWidth=7;s.beginPath();s.moveTo(220,163);s.quadraticCurveTo(212,144,203,150);s.moveTo(216,169);s.quadraticCurveTo(204,153,194,158);s.stroke();
    s.lineWidth=8;s.beginPath();s.moveTo(79,211);s.quadraticCurveTo(48,188,31,209);s.quadraticCurveTo(51,208,64,229);s.stroke();
    const front=238+gait*11,rear=246+gait2*11;
    limb(199,237,217,front,243+gait*19,293+gait*7,13);
    limb(181,246,177,244-gait*18,153-gait*20,294-gait*11,10);
    limb(111,241,100,rear,73+gait2*19,297+gait2*10,13);
    limb(92,237,77,254-gait2*13,103-gait2*22,296-gait2*8,10);
    s.lineWidth=6;s.beginPath();s.moveTo(242+gait*19,294+gait*7);s.lineTo(253+gait*19,294+gait*7);s.moveTo(72+gait2*19,298+gait2*10);s.lineTo(58+gait2*19,298+gait2*10);s.stroke();
    s.fillStyle="#000";s.beginPath();s.arc(270,153,2.5,0,Math.PI*2);s.fill();
  }
  function drawHuman(t){
    const sway=Math.sin(t*.0018)*2;
    s.fillStyle="#fff";s.strokeStyle="#fff";s.lineCap="round";s.lineJoin="round";
    s.beginPath();s.ellipse(160+sway,105,28,34,0,0,Math.PI*2);s.fill();
    s.beginPath();s.moveTo(133,148);s.quadraticCurveTo(160,138,187,148);s.lineTo(203,252);s.quadraticCurveTo(159,274,117,252);s.closePath();s.fill();
    limb(132,159,104,221,93,276,18);limb(187,159,216,219,228,276,18);
    limb(141,260,134,324,119,374,23);limb(178,260,186,324,201,374,23);
    s.lineWidth=13;s.beginPath();s.moveTo(109,377);s.lineTo(132,377);s.moveTo(191,377);s.lineTo(217,377);s.stroke();
    s.fillStyle="#000";s.beginPath();s.ellipse(151,106,2.7,1.8,0,0,Math.PI*2);s.ellipse(169,106,2.7,1.8,0,0,Math.PI*2);s.fill();
  }
  function branch(x,y,length,angle,depth,seed){
    if(depth<=0||length<3)return;
    const x2=x+Math.cos(angle)*length,y2=y+Math.sin(angle)*length;
    s.lineWidth=Math.max(1,depth*1.7);s.beginPath();s.moveTo(x,y);s.lineTo(x2,y2);s.stroke();
    if(depth===1){s.fillStyle="#ddd";s.beginPath();s.ellipse(x2,y2,3.8,7,angle,0,Math.PI*2);s.fill();return;}
    branch(x2,y2,length*.7,angle-.36,depth-1,seed+1);
    branch(x2,y2,length*.68,angle+.42,depth-1,seed+2);
    if(depth>3)branch(x2,y2,length*.57,angle+.06,depth-2,seed+3);
  }
  function drawRoots(t){
    s.strokeStyle="#fff";s.fillStyle="#fff";s.lineCap="round";
    const sway=Math.sin(t*.001)*.06;
    s.lineWidth=27;s.beginPath();s.moveTo(161,236);s.quadraticCurveTo(155,190,166,154);s.stroke();
    branch(163,174,46,-Math.PI/2+sway,5,1);
    branch(155,190,38,-2.2+sway,4,2);
    branch(174,191,42,-.95+sway,4,3);
    s.strokeStyle="#ddd";
    for(let i=0;i<9;i++){const a=Math.PI/2+(i-4)*.21;branch(160+(i-4)*2,233,27+(i%3)*8,a,4,i);}
    s.strokeStyle="#999";s.lineWidth=2;s.beginPath();s.moveTo(34,245);s.lineTo(286,245);s.stroke();
  }
  function drawGalaxy(t){
    const rot=t*.00009;
    for(let i=0;i<4000;i++){
      const arm=i%3,rad=Math.sqrt(hash(i,31))*135,a=rad*.036+arm*Math.PI*2/3+rot+(hash(i,52)-.5)*.55;
      const x=160+Math.cos(a)*rad,y=211+Math.sin(a)*rad*.55;
      const val=130+Math.floor(125*(1-rad/145));s.fillStyle=`rgb(${val},${val},${val})`;
      s.fillRect(x,y,hash(i,11)>.91?2:1,hash(i,11)>.91?2:1);
    }
    const glow=s.createRadialGradient(160,211,2,160,211,33);glow.addColorStop(0,"#fff");glow.addColorStop(1,"#0000");s.fillStyle=glow;s.fillRect(120,171,80,80);
  }
  function drawPlanet(){
    s.fillStyle="#fff";s.strokeStyle="#fff";
    s.beginPath();s.arc(158,206,92,0,Math.PI*2);s.fill();
    s.fillStyle="#777";for(let i=0;i<27;i++){const x=85+hash(i,1)*145,y=132+hash(i,2)*145;if(Math.hypot(x-158,y-206)<79){s.beginPath();s.arc(x,y,2+hash(i,3)*11,0,Math.PI*2);s.fill();}}
    s.strokeStyle="#fff";s.lineWidth=6;s.beginPath();s.ellipse(158,206,143,43,-.26,0,Math.PI*2);s.stroke();
    s.strokeStyle="#888";s.lineWidth=2;s.beginPath();s.ellipse(158,206,155,50,-.26,0,Math.PI*2);s.stroke();
  }
  function drawBird(t){
    const flap=Math.sin(t*.009)*22;
    s.fillStyle="#fff";s.strokeStyle="#fff";s.lineCap="round";s.lineJoin="round";
    s.beginPath();s.ellipse(164,220,69,30,-.12,0,Math.PI*2);s.fill();
    s.beginPath();s.arc(226,198,25,0,Math.PI*2);s.fill();
    s.beginPath();s.moveTo(246,192);s.lineTo(286,201);s.lineTo(245,208);s.closePath();s.fill();
    s.beginPath();s.moveTo(103,215);s.lineTo(49,192);s.lineTo(65,229);s.lineTo(91,236);s.closePath();s.fill();
    s.beginPath();s.moveTo(166,213);s.quadraticCurveTo(124,130+flap,58,129+flap);s.quadraticCurveTo(112,178+flap*.4,162,241);s.closePath();s.fill();
    s.fillStyle="#000";s.beginPath();s.arc(235,192,3.3,0,Math.PI*2);s.fill();
  }
  function drawFish(t){
    const swim=Math.sin(t*.007)*13;
    s.fillStyle="#fff";s.strokeStyle="#fff";s.lineCap="round";
    s.beginPath();s.ellipse(155,215,88,47,0,0,Math.PI*2);s.fill();
    s.beginPath();s.moveTo(82,209);s.lineTo(33,166+swim);s.lineTo(37,255+swim);s.closePath();s.fill();
    s.beginPath();s.moveTo(147,175);s.lineTo(164,123);s.lineTo(187,179);s.closePath();s.fill();
    s.beginPath();s.moveTo(149,256);s.lineTo(177,289);s.lineTo(198,250);s.closePath();s.fill();
    s.fillStyle="#000";s.beginPath();s.arc(207,204,4,0,Math.PI*2);s.fill();
    s.strokeStyle="#777";s.lineWidth=3;for(let i=0;i<4;i++){s.beginPath();s.arc(120+i*24,211,22,-1.1,1.1);s.stroke();}
    for(let i=0;i<14;i++){const x=15+hash(i,7)*290,y=105+hash(i,8)*220,r=1+hash(i,9)*4;s.fillStyle="#bbb";s.beginPath();s.arc(x,y,r,0,Math.PI*2);s.fill();}
  }
  function drawButterfly(t){
    const flap=.75+Math.abs(Math.sin(t*.006))*.25;
    s.fillStyle="#fff";s.strokeStyle="#fff";s.lineWidth=3;
    for(const side of [-1,1]){
      s.save();s.translate(160,204);s.scale(side*flap,1);
      s.beginPath();s.moveTo(0,-7);s.bezierCurveTo(43,-114,151,-115,129,-25);s.bezierCurveTo(117,21,58,25,0,8);s.closePath();s.fill();
      s.beginPath();s.moveTo(0,9);s.bezierCurveTo(74,7,117,75,91,119);s.bezierCurveTo(50,143,14,84,0,20);s.closePath();s.fill();
      s.fillStyle="#444";s.beginPath();s.ellipse(82,-38,13,22,.4,0,Math.PI*2);s.ellipse(58,61,10,14,-.3,0,Math.PI*2);s.fill();
      s.restore();s.fillStyle="#fff";
    }
    s.beginPath();s.ellipse(160,205,9,75,0,0,Math.PI*2);s.fill();
    s.beginPath();s.moveTo(157,140);s.quadraticCurveTo(142,106,123,105);s.moveTo(163,140);s.quadraticCurveTo(178,106,197,105);s.stroke();
  }
  function drawMountains(){
    s.fillStyle="#bbb";s.beginPath();s.moveTo(0,307);s.lineTo(84,151);s.lineTo(154,272);s.lineTo(214,180);s.lineTo(320,317);s.closePath();s.fill();
    s.fillStyle="#fff";s.beginPath();s.moveTo(0,317);s.lineTo(139,91);s.lineTo(239,316);s.closePath();s.fill();
    s.fillStyle="#222";s.beginPath();s.moveTo(139,91);s.lineTo(239,316);s.lineTo(149,219);s.lineTo(164,177);s.closePath();s.fill();
    s.fillStyle="#555";s.beginPath();s.moveTo(0,326);s.lineTo(72,236);s.lineTo(138,326);s.lineTo(222,264);s.lineTo(320,326);s.closePath();s.fill();
    s.fillStyle="#fff";for(let i=0;i<90;i++){const x=hash(i,51)*320,y=hash(i,52)*155;if(hash(i,53)>.72)s.fillRect(x,y,1.5,1.5);}
  }
  function drawNebula(t){
    const cloud=s.createRadialGradient(155,215,9,155,215,151);
    cloud.addColorStop(0,"#fff");cloud.addColorStop(.22,"#aaa");cloud.addColorStop(.6,"#444");cloud.addColorStop(1,"#000");
    s.save();s.translate(160,210);s.rotate(-.4+Math.sin(t*.0003)*.1);s.scale(1,.56);s.translate(-160,-210);
    s.fillStyle=cloud;s.fillRect(0,30,320,360);s.restore();
    for(let i=0;i<2600;i++){const x=hash(i,81)*320,y=hash(i,82)*420;
      const dx=(x-160)/156,dy=(y-210)/100,d=Math.hypot(dx,dy);
      if(d<1.2&&hash(i,83)>.34){const a=Math.floor(100+hash(i,84)*155);s.fillStyle=`rgb(${a},${a},${a})`;s.fillRect(x,y,hash(i,85)>.94?2:1,1);}}
  }
  function drawSource(t){
    s.fillStyle="#000";s.fillRect(0,0,320,420);
    if(index===0){if(!cover(assets.face))drawHuman(t);}
    else if(index===1)drawHorse(t);
    else if(index===2)drawHuman(t);
    else if(index===3)drawRoots(t);
    else if(index===4)drawGalaxy(t);
    else if(index===5)drawPlanet();
    else if(index===6)drawBird(t);
    else if(index===7)drawFish(t);
    else if(index===8)drawButterfly(t);
    else if(index===9)drawMountains();
    else if(index===10)drawNebula(t);
    else if(!cover(assets.abstract))drawGalaxy(t);
  }
  function draw(t){
    if(!width||!height)return;
    drawSource(t);
    const pixels=s.getImageData(0,0,320,420).data;
    ctx.fillStyle="#020202";ctx.fillRect(0,0,width,height);
    const pitch=width<500?4.9:5.6,cols=Math.ceil(width/pitch),rows=Math.ceil(height/pitch);
    const elapsed=t-start;
    const fade=reduced.matches?1:Math.min(1,elapsed/650,Math.max(0,(5000-elapsed)/550));
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const sx=Math.min(319,Math.floor((x+.5)/cols*320)),sy=Math.min(419,Math.floor((y+.5)/rows*420));
      const p=(sy*320+sx)*4,lum=(pixels[p]+pixels[p+1]+pixels[p+2])/765;
      const star=hash(x,y,index)> .995?.23:0;
      const v=Math.max(star,Math.pow(lum,.75)*fade);
      if(v<.085)continue;
      const r=Math.min(pitch*.37,Math.max(.37,v*pitch*.34));
      ctx.fillStyle=`rgba(245,245,245,${Math.min(1,.17+v*.85)})`;
      ctx.beginPath();ctx.arc((x+.5)*pitch,(y+.5)*pitch,r,0,Math.PI*2);ctx.fill();
    }
    canvas.classList.add("is-ready");
  }
  function tick(t){
    if(!document.hidden&&t-last>40){last=t;if(!reduced.matches&&t-start>5000)choose(index+1);else draw(t);}
    requestAnimationFrame(tick);
  }
  assets.face.onload=()=>draw(performance.now());assets.abstract.onload=()=>draw(performance.now());
  updateLabels();resize();requestAnimationFrame(tick);
}
