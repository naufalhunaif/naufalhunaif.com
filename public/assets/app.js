// Every character occupies a 7 × 9 dot cell. The 5 × 7 strokes are centered
// inside that cell, leaving a one-dot margin on every side.
const GLYPHS = {
  A:["01110","10001","10001","11111","10001","10001","10001"],
  B:["11110","10001","10001","11110","10001","10001","11110"],
  C:["01111","10000","10000","10000","10000","10000","01111"],
  D:["11110","10001","10001","10001","10001","10001","11110"],
  E:["11111","10000","10000","11110","10000","10000","11111"],
  F:["11111","10000","10000","11110","10000","10000","10000"],
  G:["01111","10000","10000","10111","10001","10001","01111"],
  H:["10001","10001","10001","11111","10001","10001","10001"],
  I:["11111","00100","00100","00100","00100","00100","11111"],
  J:["00111","00010","00010","00010","10010","10010","01100"],
  K:["10001","10010","10100","11000","10100","10010","10001"],
  L:["10000","10000","10000","10000","10000","10000","11111"],
  M:["10001","11011","10101","10101","10001","10001","10001"],
  N:["10001","11001","10101","10011","10001","10001","10001"],
  O:["01110","10001","10001","10001","10001","10001","01110"],
  P:["11110","10001","10001","11110","10000","10000","10000"],
  Q:["01110","10001","10001","10001","10101","10010","01101"],
  R:["11110","10001","10001","11110","10100","10010","10001"],
  S:["01111","10000","10000","01110","00001","00001","11110"],
  T:["11111","00100","00100","00100","00100","00100","00100"],
  U:["10001","10001","10001","10001","10001","10001","01110"],
  V:["10001","10001","10001","10001","10001","01010","00100"],
  W:["10001","10001","10001","10101","10101","10101","01010"],
  X:["10001","10001","01010","00100","01010","10001","10001"],
  Y:["10001","10001","01010","00100","00100","00100","00100"],
  Z:["11111","00001","00010","00100","01000","10000","11111"],
  "0":["01110","10001","10011","10101","11001","10001","01110"],
  "1":["00100","01100","00100","00100","00100","00100","01110"],
  "2":["01110","10001","00001","00010","00100","01000","11111"],
  "3":["11110","00001","00001","01110","00001","00001","11110"],
  "4":["00010","00110","01010","10010","11111","00010","00010"],
  "5":["11111","10000","10000","11110","00001","00001","11110"],
  "6":["01110","10000","10000","11110","10001","10001","01110"],
  "7":["11111","00001","00010","00100","01000","01000","01000"],
  "8":["01110","10001","10001","01110","10001","10001","01110"],
  "9":["01110","10001","10001","01111","00001","00001","01110"],
  ".":["00000","00000","00000","00000","00000","00110","00110"],
  ",":["00000","00000","00000","00000","00110","00110","00100"],
  ":":["00000","00100","00100","00000","00100","00100","00000"],
  "/":["00001","00001","00010","00100","01000","10000","10000"],
  "&":["01100","10010","10100","01000","10101","10010","01101"],
  "-":["00000","00000","00000","11111","00000","00000","00000"],
  "×":["00000","10001","01010","00100","01010","10001","00000"],
  "+":["00000","00100","00100","11111","00100","00100","00000"],
  "[": ["01110","01000","01000","01000","01000","01000","01110"],
  "]": ["01110","00010","00010","00010","00010","00010","01110"],
  "©":["01110","10001","10111","10100","10111","10001","01110"],
  "↑":["00100","01110","10101","00100","00100","00100","00100"],
  "↓":["00100","00100","00100","00100","10101","01110","00100"],
  "↗":["00001","00011","00101","01001","10001","00000","00000"],
  "∞":["00000","00000","01010","10101","10101","01010","00000"],
  "●":["00000","01110","11111","11111","11111","01110","00000"],
  "?":["01110","10001","00001","00010","00100","00000","00100"],
  " ":["00000","00000","00000","00000","00000","00000","00000"]
};

const ICONS = {
  monogram:["100000101","110000101","101000101","100100101","100010101","100001101","100000111","000000000","111111111"],
  "arrow-down":["000010000","000010000","000010000","000010000","100010001","010010010","001010100","000101000","000010000"],
  "arrow-up":["000010000","000101000","001010100","010010010","100010001","000010000","000010000","000010000","000010000"],
  "arrow-right":["000010000","000001000","000000100","111111110","000000100","000001000","000010000","000000000","000000000"],
  asterisk:["100010001","010010010","001010100","000111000","111111111","000111000","001010100","010010010","100010001"],
  spark:["000010000","000010000","000101000","111111111","000101000","000010000","000010000","000000000","000000000"],
  grid:["111011101","101010101","111011101","000000000","111011101","101010101","111011101","000000000","000000000"]
};

const NS = "http://www.w3.org/2000/svg";
function circle(x,y,r,opacity=1,fill="currentColor") {
  const c=document.createElementNS(NS,"circle");
  c.setAttribute("cx",x);c.setAttribute("cy",y);c.setAttribute("r",r);
  c.setAttribute("fill",fill);if(opacity!==1)c.setAttribute("opacity",opacity);
  return c;
}
function svg(width,height) {
  const node=document.createElementNS(NS,"svg");
  node.setAttribute("viewBox",`0 0 ${width} ${height}`);
  node.setAttribute("aria-hidden","true");node.setAttribute("focusable","false");
  return node;
}
function wrapWords(text,maxChars) {
  if(!maxChars || text.length<=maxChars)return [text];
  const lines=[];let line="";
  for(const word of text.split(/\s+/)) {
    if(!word)continue;
    if(line && `${line} ${word}`.length>maxChars){lines.push(line);line=word;}
    else line=line?`${line} ${word}`:word;
  }
  if(line)lines.push(line);
  return lines.length?lines:[text];
}
function renderText(el) {
  const value=(el.dataset.originalText ?? el.textContent).trim().toUpperCase();
  el.dataset.originalText=value;
  const pitch=parseFloat(getComputedStyle(el).getPropertyValue("--dot-pitch"))||3;
  let maxChars=0;
  if(el.classList.contains("dot-wrap")) {
    const width=el.parentElement.getBoundingClientRect().width;
    maxChars=Math.max(6,Math.floor(width/(8*pitch)));
  }
  const lines=wrapWords(value,maxChars);
  const longest=Math.max(...lines.map(line=>line.length),1);
  const view=svg(longest*80,lines.length*105-15);
  view.setAttribute("width",Math.ceil(longest*8*pitch));
  view.setAttribute("height",Math.ceil((lines.length*10.5-1.5)*pitch));
  const fragment=document.createDocumentFragment();
  lines.forEach((line,li)=>{
    [...line].forEach((letter,ci)=>{
      const glyph=GLYPHS[letter]||GLYPHS["?"];
      for(let row=0;row<7;row++)for(let col=0;col<5;col++) {
        const x=(ci*8+col+1)*10+5,y=(li*10.5+row+1)*10+5;
        if(glyph[row][col]==="1")fragment.appendChild(circle(x,y,3.5));
        else if(el.classList.contains("dot-display"))fragment.appendChild(circle(x,y,1.8,.13));
      }
    });
  });
  view.appendChild(fragment);
  const spoken=document.createElement("span");spoken.className="sr-only";spoken.textContent=value;
  el.replaceChildren(view,spoken);
}
function renderIcon(el) {
  const pattern=ICONS[el.dataset.dotIcon];if(!pattern)return;
  const view=svg(90,90);view.setAttribute("width","100%");view.setAttribute("height","100%");
  const frag=document.createDocumentFragment();
  pattern.forEach((line,y)=>[...line].forEach((v,x)=>{if(v==="1")frag.appendChild(circle(x*10+5,y*10+5,3.5));}));
  view.appendChild(frag);el.replaceChildren(view);
}
function renderSphere() {
  const target=document.querySelector("[data-dot-sphere]");if(!target)return;
  const view=svg(390,390),frag=document.createDocumentFragment();
  for(let y=0;y<39;y++)for(let x=0;x<39;x++) {
    const dx=x-19,dy=y-19,d=Math.hypot(dx,dy);
    if(d>17.7)continue;
    const ring=Math.abs(d-16.8)<1.1||Math.abs(d-11.8)<.8;
    const wave=Math.sin(x*.43+y*.31)+Math.cos(y*.39-x*.2);
    if(!ring && wave<-.45)continue;
    const opacity=ring?.9:Math.max(.2,.47+(wave*.13)-(d*.006));
    frag.appendChild(circle(x*10+5,y*10+5,ring?2.55:2.1,opacity,ring?"#c9f86a":"#86ac68"));
  }
  view.appendChild(frag);target.appendChild(view);
}
function renderCardArt() {
  document.querySelectorAll("[data-card-art]").forEach((target)=>{
    const kind=target.dataset.cardArt,view=svg(210,180),frag=document.createDocumentFragment();
    for(let y=0;y<18;y++)for(let x=0;x<21;x++) {
      const dx=x-10,dy=y-8.5,d=Math.hypot(dx,dy);
      let on=false,accent=false;
      if(kind==="idea") {on=(d<5.4&&d>3.7)||(Math.abs(dx)<.6&&Math.abs(dy)>6&&Math.abs(dy)<8.5)||(Math.abs(dy)<.6&&Math.abs(dx)>7&&Math.abs(dx)<10)||((Math.abs(Math.abs(dx)-Math.abs(dy))<.7)&&d>7&&d<10);accent=d<3.5;}
      if(kind==="process") {on=(x>=2&&x<=7&&y>=3&&y<=8&&(x===2||x===7||y===3||y===8))||(x>=13&&x<=18&&y>=9&&y<=14&&(x===13||x===18||y===9||y===14))||(x>=8&&x<=12&&y===8)||(x===11&&y>=9&&y<=12);accent=(x===5&&y===5)||(x===16&&y===12);}
      if(kind==="make") {on=(Math.abs(dy+dx*.8)<1&&x>=2&&x<=17)||(x>=13&&x<=18&&Math.abs(dy-(x-14))<1)||(x>=13&&x<=18&&Math.abs(dy+(x-14))<1);accent=(x>=15&&on);}
      if(on||accent)frag.appendChild(circle(x*10+5,y*10+5,accent?3.5:2.8,accent?1:.75,accent?"#f4a77b":"#c9f86a"));
    }
    view.appendChild(frag);target.appendChild(view);
  });
}
document.querySelectorAll("[data-dot-icon]").forEach(renderIcon);
renderSphere();renderCardArt();
let frame;
function renderAllText(){document.querySelectorAll(".dot-text").forEach(renderText);}
renderAllText();
window.dotMatrixRender=renderText;
window.addEventListener("resize",()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(renderAllText);},{passive:true});
