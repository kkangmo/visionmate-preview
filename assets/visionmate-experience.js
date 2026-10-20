// Progressive enhancement: independent of the existing hero and its scroll controller.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover:hover) and (pointer:fine)');
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const bound = new WeakSet();
const scenes = new Map();
const reveal = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    reveal.unobserve(entry.target);
  }
}, {threshold:.12, rootMargin:'0px 0px -30px 0px'});

function createScene(section) {
  const canvas = section.querySelector('canvas');
  const ctx = canvas?.getContext('2d', {alpha:true});
  if (!ctx) return () => {};
  let width=1,height=1,dpr=1,visible=false,frame=0,last=0,time=0,disposed=false;
  let pointerX=0,pointerY=0,followX=0,followY=0;
  const phases=[...section.querySelectorAll('[data-phase]')];
  const fract=v=>v-Math.floor(v);
  const stars=Array.from({length:80},(_,i)=>({x:fract(Math.sin(i*12.9898)*43758.5453),y:fract(Math.cos(i*78.233)*23421.631),z:(i%13)/13,r:i%11===0?1.7:.6}));
  const curves=[];
  for(let j=0;j<12;j++) {
    const curve=[];
    for(let i=0;i<=100;i++) {
      const u=i/100*Math.PI*2,v=j/12*Math.PI*2;
      const radius=1.12+.32*Math.cos(v);
      curve.push([radius*Math.cos(u),radius*Math.sin(u),.32*Math.sin(v)]);
    }
    curves.push(curve);
  }
  for(let j=0;j<32;j++) {
    const curve=[],u=j/32*Math.PI*2;
    for(let i=0;i<=24;i++) {
      const v=i/24*Math.PI*2,radius=1.12+.32*Math.cos(v);
      curve.push([radius*Math.cos(u),radius*Math.sin(u),.32*Math.sin(v)]);
    }
    curves.push(curve);
  }
  function resize() {
    const r=canvas.getBoundingClientRect(); width=r.width;height=r.height;
    dpr=Math.min(devicePixelRatio||1,innerWidth<700?1.25:1.6);
    canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
    if(reduced.matches) draw(0);
  }
  function progress() {
    const r=section.getBoundingClientRect(),travel=Math.max(1,section.offsetHeight-innerHeight+76);
    const p=clamp(-r.top/travel);
    section.style.setProperty('--scene-progress',p.toFixed(4));
    phases.forEach((el,i)=>el.classList.toggle('is-active',i===Math.min(3,Math.floor(p*4))));
    return p;
  }
  function draw(t) {
    if(!width||!height) return;
    const p=progress(),mobile=width<700;
    followX+=(pointerX-followX)*.055;followY+=(pointerY-followY)*.055;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const cx=width*(mobile?.69:.73)+followX*20,cy=height*(mobile?.64:.5)+followY*15;
    const scale=Math.min(width*(mobile?.36:.23),height*.34)*(1+p*.13);
    const rotation=.25+Math.sin(t*.00013)*.18+p*.6+followX*.18,tilt=.85+Math.sin(t*.00009)*.12+followY*.15;
    const ca=Math.cos(rotation),sa=Math.sin(rotation),cb=Math.cos(tilt),sb=Math.sin(tilt);
    function project(point) {
      const [x,y,z]=point;
      const a=x*ca-z*sa,c=x*sa+z*ca,b=y*cb-c*sb,depth=y*sb+c*cb;
      const perspective=4/(4+depth);
      return [cx+a*scale*perspective,cy+b*scale*perspective,depth];
    }
    const halo=ctx.createRadialGradient(cx,cy,0,cx,cy,scale*2.3);
    halo.addColorStop(0,'rgba(34,91,196,.12)');halo.addColorStop(.5,'rgba(40,91,183,.06)');halo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
    for(const star of stars) {
      const x=star.x*width+Math.sin(t*.00005+star.z*6)*10,y=star.y*height;
      ctx.fillStyle=`rgba(145,190,255,${.12+star.z*.35})`;
      ctx.beginPath();ctx.arc(x,y,star.r,0,Math.PI*2);ctx.fill();
    }
    const surface=[];
    for(let j=0;j<12;j++)for(let i=0;i<100;i+=2) {
      const cell=[project(curves[j][i]),project(curves[j][i+2]),project(curves[(j+1)%12][i+2]),project(curves[(j+1)%12][i])];
      surface.push({cell,z:cell.reduce((a,q)=>a+q[2],0)/4});
    }
    surface.sort((a,b)=>b.z-a.z);
    for(const {cell,z} of surface) {
      const light=clamp((1.5-z)/3);
      ctx.fillStyle=`rgba(${22+light*30},${48+light*55},${95+light*100},.28)`;
      ctx.beginPath();ctx.moveTo(cell[0][0],cell[0][1]);for(let k=1;k<4;k++)ctx.lineTo(cell[k][0],cell[k][1]);ctx.closePath();ctx.fill();
    }
    const buckets=Array.from({length:6},()=>[]);
    for(const curve of curves) {
      let prev=project(curve[0]);
      for(let i=1;i<curve.length;i++) {
        const next=project(curve[i]),bucket=Math.floor(clamp((prev[2]+next[2]+3)/6)*5);
        buckets[bucket].push([prev,next]);prev=next;
      }
    }
    ctx.globalCompositeOperation='lighter';
    for(let b=5;b>=0;b--) {
      ctx.beginPath();
      for(const [a,c] of buckets[b]){ctx.moveTo(a[0],a[1]);ctx.lineTo(c[0],c[1]);}
      ctx.strokeStyle=`rgba(${105+b*12},${153+b*9},255,${.09+(5-b)*.075})`;
      ctx.lineWidth=b<2?1.05:.65;ctx.stroke();
    }
    for(let i=0;i<38;i++) {
      const u=i/38*Math.PI*2+t*.00008;
      const q=project([1.44*Math.cos(u),1.44*Math.sin(u),0]);
      if(q[2]<.5) {
        ctx.fillStyle='rgba(167,214,255,.85)';ctx.shadowBlur=9;ctx.shadowColor='#488eff';
        ctx.beginPath();ctx.arc(q[0],q[1],i%7===0?1.8:.75,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.shadowBlur=0;ctx.globalCompositeOperation='source-over';
  }
  function tick(now) {
    frame=0;
    if(disposed||!visible||document.hidden||reduced.matches) return;
    if(now-last>=32){time=now;draw(now);last=now;}
    frame=requestAnimationFrame(tick);
  }
  function resume(){if(visible&&!document.hidden&&!frame&&!reduced.matches)frame=requestAnimationFrame(tick);else if(reduced.matches)draw(0);}
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});
  const ro=new ResizeObserver(resize);ro.observe(canvas);io.observe(section);
  const move=e=>{if(!fine.matches)return;const r=section.querySelector('.vm-immersion-stage').getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;};
  const leave=()=>{pointerX=0;pointerY=0;};
  section.addEventListener('pointermove',move,{passive:true});section.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);
  resize();draw(0);resume();
  return ()=>{disposed=true;cancelAnimationFrame(frame);io.disconnect();ro.disconnect();section.removeEventListener('pointermove',move);section.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);};
}

function scan() {
  for(const [el,dispose] of scenes)if(!el.isConnected){dispose();scenes.delete(el);}
  document.querySelectorAll('.vm-immersion').forEach(el=>{if(!scenes.has(el))scenes.set(el,createScene(el));});
  document.querySelectorAll('.vm-positioning-head,.vm-operating-model,.product-story,.vm-process-heading,.vm-process-list > li,.vm-cta-type').forEach((el,i)=>{
    if(bound.has(el))return;bound.add(el);
    if(!reduced.matches){el.classList.add('vm-reveal');el.style.transitionDelay=(i%3)*65+'ms';reveal.observe(el);}
  });
  document.querySelectorAll('.primary-button,.final-cta-primary,.vm-inline-link').forEach(el=>{
    if(el.dataset.vmMagnetic)return;el.dataset.vmMagnetic='true';el.classList.add('vm-magnetic');
    el.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--magnetic-x',clamp((e.clientX-r.left-r.width/2)*.06,-5,5)+'px');el.style.setProperty('--magnetic-y',clamp((e.clientY-r.top-r.height/2)*.1,-4,4)+'px');},{passive:true});
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--magnetic-x','0px');el.style.setProperty('--magnetic-y','0px');});
  });
  document.querySelectorAll('.product-story').forEach(el=>{
    if(el.dataset.vmLight)return;el.dataset.vmLight='true';
    el.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;el.style.setProperty('--light-x',x+'px');el.style.setProperty('--light-y',y+'px');el.style.setProperty('--tilt-x',((.5-y/r.height)*3)+'deg');el.style.setProperty('--tilt-y',((x/r.width-.5)*4)+'deg');},{passive:true});
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});
  });
}
let scheduled=false;
new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;scan();});}}).observe(document.body,{childList:true,subtree:true});
reduced.addEventListener('change',()=>{if(reduced.matches)document.querySelectorAll('.vm-reveal').forEach(el=>el.classList.add('is-visible'));});
scan();
