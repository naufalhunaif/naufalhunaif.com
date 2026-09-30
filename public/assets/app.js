const DOT_ICONS={
  mark:["100010001","010010010","001010100","000111000","111111111","000111000","001010100","010010010","100010001"],
  shuffle:["000000000","110000011","001000101","000101001","000010000","000101001","001000101","110000011","000000000"],
  left:["000100000","001100000","011111110","111111110","011111110","001100000","000100000","000000000","000000000"],
  right:["000001000","000001100","011111110","011111111","011111110","000001100","000001000","000000000","000000000"],
  pause:["000000000","001001000","001001000","001001000","001001000","001001000","001001000","000000000","000000000"],
  play:["000000000","001000000","001100000","001110000","001111000","001110000","001100000","001000000","000000000"]
};
const SVG_NS="http://www.w3.org/2000/svg";
function drawDotIcon(element,name){
  const pattern=DOT_ICONS[name];if(!pattern)return;
  const svg=document.createElementNS(SVG_NS,"svg");svg.setAttribute("viewBox","0 0 90 90");svg.setAttribute("width","100%");svg.setAttribute("height","100%");svg.setAttribute("aria-hidden","true");svg.setAttribute("focusable","false");
  const group=document.createDocumentFragment();
  pattern.forEach((row,y)=>[...row].forEach((value,x)=>{
    if(value!=="1")return;
    const dot=document.createElementNS(SVG_NS,"circle");dot.setAttribute("cx",x*10+5);dot.setAttribute("cy",y*10+5);dot.setAttribute("r",3.2);dot.setAttribute("fill","currentColor");group.appendChild(dot);
  }));
  svg.appendChild(group);element.replaceChildren(svg);
}
window.drawDotIcon=drawDotIcon;
document.querySelectorAll("[data-dot-icon]").forEach(element=>drawDotIcon(element,element.dataset.dotIcon));
