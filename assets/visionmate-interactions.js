/* Delegated pointer events support React route changes without DOM rewriting. */
const vmCardSelector='.public-site :is(.ss-sel,.route-card,.product-hub-card)';
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
