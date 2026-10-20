/* Delegated pointer events support React route changes without DOM rewriting. */
const vmCardSelector='.public-site :is(.ss-sel,.route-card,.product-hub-card,.product-story)';
const vmFinePointer=matchMedia('(hover:hover) and (pointer:fine)');
function vmEdge(event,element){
 const box=element.getBoundingClientRect();
 const x=(event.clientX-box.left)/Math.max(box.width,1);
 const y=(event.clientY-box.top)/Math.max(box.height,1);
 return [[x,'left'],[1-x,'right'],[y,'top'],[1-y,'bottom']].sort((a,b)=>a[0]-b[0])[0][1];
}
document.addEventListener('pointerover',event=>{
 if(!vmFinePointer.matches||event.pointerType==='touch'||!(event.target instanceof Element))return;
 const card=event.target.closest(vmCardSelector);
 if(!card||(event.relatedTarget instanceof Node&&card.contains(event.relatedTarget)))return;
 card.dataset.vmEdge=vmEdge(event,card);
 card.dataset.vmOver='true';
});
document.addEventListener('pointerout',event=>{
 if(!(event.target instanceof Element))return;
 const card=event.target.closest(vmCardSelector);
 if(!card||(event.relatedTarget instanceof Node&&card.contains(event.relatedTarget)))return;
 card.dataset.vmEdge=vmEdge(event,card);
 delete card.dataset.vmOver;
});
window.addEventListener('blur',()=>document.querySelectorAll('[data-vm-over]').forEach(card=>delete card.dataset.vmOver));

const vmPressSelector='.public-site :is(.header-cta,.primary-button,.text-button,.final-cta-primary,.final-cta-secondary,.ss-sel,.route-card,.product-hub-card)';
const vmReduceMotion=matchMedia('(prefers-reduced-motion:reduce)');
const vmPressTimers=new WeakMap();
function vmPress(target,event){
 if(target.matches(':disabled,[aria-disabled="true"]'))return;
 clearTimeout(vmPressTimers.get(target));
 target.classList.add('vm-press');
 vmPressTimers.set(target,setTimeout(()=>target.classList.remove('vm-press'),180));
 if(vmReduceMotion.matches)return;
 const box=target.getBoundingClientRect();
 const size=Math.hypot(box.width,box.height)*2;
 const wave=document.createElement('span');
 wave.className='vm-click-wave';wave.setAttribute('aria-hidden','true');
 const pointer=event.type==='pointerdown';
 Object.assign(wave.style,{width:size+'px',height:size+'px',left:(pointer?event.clientX-box.left:box.width/2)+'px',top:(pointer?event.clientY-box.top:box.height/2)+'px'});
 target.querySelectorAll('.vm-click-wave').forEach(previous=>previous.remove());
 target.append(wave);
 const animation=wave.animate([{transform:'translate(-50%,-50%) scale(0)',opacity:.42},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
 animation.finished.then(()=>wave.remove(),()=>wave.remove());
}
document.addEventListener('pointerdown',event=>{
 if(event.button!==0||!(event.target instanceof Element))return;
 const target=event.target.closest(vmPressSelector);
 if(target)vmPress(target,event);
},{passive:true});
document.addEventListener('click',event=>{
 if(event.detail!==0||!(event.target instanceof Element))return;
 const target=event.target.closest(vmPressSelector);
 if(target)vmPress(target,event);
});
