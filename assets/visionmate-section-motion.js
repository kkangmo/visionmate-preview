/* Viewport-driven body storytelling. Never intercepts input or seeks hero media. */
const vmSectionSelector='.home-route :is(.vm-positioning,.product-story,.vm-process,.vm-solution-visual,.final-cta-redesign)';
const vmSections=new Set(),vmVisibleSections=new Set();
const vmSectionReduced=matchMedia('(prefers-reduced-motion:reduce)');
let vmSectionFrame=0,vmScanFrame=0;
const vmClamp=value=>Math.min(1,Math.max(0,value));
function vmMarkCurrent(rows,index){
 rows.forEach((row,i)=>{const value=i===index?'true':'false';if(row.dataset.vmCurrent!==value)row.dataset.vmCurrent=value;});
}
function vmUpdateSections(){
 vmSectionFrame=0;
 const height=window.innerHeight;
 for(const section of vmVisibleSections){
  if(!section.isConnected){vmVisibleSections.delete(section);continue;}
  if(vmSectionReduced.matches)continue;
  const rect=section.getBoundingClientRect();
  const progress=vmClamp((height*.72-rect.top)/(rect.height+height*.2));
  section.style.setProperty('--vm-section-progress',progress.toFixed(4));
  if(section.matches('.vm-positioning,.vm-process')){
   const rows=Array.from(section.querySelectorAll(section.matches('.vm-process')?'.vm-process-list>li':'.vm-model-row'));
   let nearest=0,distance=Infinity;
   rows.forEach((row,i)=>{const box=row.getBoundingClientRect();const delta=Math.abs(box.top+box.height*.5-height*.52);if(delta<distance){distance=delta;nearest=i;}});
   vmMarkCurrent(rows,nearest);
   if(section.matches('.vm-process')){
    const list=section.querySelector('.vm-process-list'),box=list.getBoundingClientRect();
    list.style.setProperty('--vm-process-progress',vmClamp((height*.52-box.top)/box.height).toFixed(4));
   }
  }
  if(section.matches('.product-story')){
   const rows=Array.from(section.querySelectorAll('.product-flow>li'));
   vmMarkCurrent(rows,Math.min(rows.length-1,Math.floor(progress*rows.length)));
   const step=String(Math.min(2,Math.floor(progress*3)));
   if(section.dataset.vmFlowStep!==step)section.dataset.vmFlowStep=step;
  }
 }
}
function vmScheduleSections(){if(!vmSectionFrame)vmSectionFrame=requestAnimationFrame(vmUpdateSections);}
const vmSectionObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){
  const section=entry.target;
  if(entry.isIntersecting){
   vmVisibleSections.add(section);section.dataset.vmInView='true';
   if(!section.dataset.vmSeen)section.dataset.vmSeen='true';
  }else{vmVisibleSections.delete(section);delete section.dataset.vmInView;}
 }
 vmScheduleSections();
},{threshold:0,rootMargin:'0px'});
function vmScanSections(){
 vmScanFrame=0;
 for(const section of vmSections)if(!section.isConnected){vmSectionObserver.unobserve(section);vmVisibleSections.delete(section);vmSections.delete(section);}
 document.querySelectorAll(vmSectionSelector).forEach(section=>{
  if(vmSections.has(section))return;
  vmSections.add(section);section.dataset.vmMotionReady='true';vmSectionObserver.observe(section);
 });
}
new MutationObserver(()=>{if(!vmScanFrame)vmScanFrame=requestAnimationFrame(vmScanSections);}).observe(document.querySelector('[data-generated-space-root]')||document.body,{childList:true,subtree:true});
document.addEventListener('scroll',vmScheduleSections,{capture:true,passive:true});
window.addEventListener('resize',vmScheduleSections,{passive:true});
vmSectionReduced.addEventListener('change',vmScheduleSections);
vmScanSections();
