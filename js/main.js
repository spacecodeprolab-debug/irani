/* Shared behaviour. No dependencies. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Mobile nav */
const burger=$('.burger'),nav=$('.nav');
const setNav=o=>{nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
burger.addEventListener('click',()=>setNav(!nav.classList.contains('open')));
$$('.nav a').forEach(a=>a.addEventListener('click',()=>setNav(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')setNav(false)});
matchMedia('(min-width:861px)').addEventListener('change',()=>setNav(false));
/* Photo slots: use the photo if the file exists, else keep the placeholder */
$$('[data-img]').forEach(el=>{const im=new Image();
  im.onload=()=>{el.style.backgroundImage=`url("${el.dataset.img}")`;el.classList.add('has');el.setAttribute('role','img');el.setAttribute('aria-label',el.dataset.alt||'');el.closest('.print')?.classList.add('has')};
  im.src=el.dataset.img});
/* Scroll: header size + story ledger */
const hdr=$('.site-header'),led=$('.ledger');let tick=false;
function onScroll(){hdr.classList.toggle('s',scrollY>8);
  if(led){const r=led.getBoundingClientRect(),mid=innerHeight*.6;
    led.style.setProperty('--p',Math.max(0,Math.min(1,(mid-r.top)/r.height)));
    $$('.lr',led).forEach(x=>x.classList.toggle('on',x.getBoundingClientRect().top<mid))}
  tick=false}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
/* Reveal */
const els=$$('.rv,.imgr');
if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});els.forEach(el=>io.observe(el))}else els.forEach(el=>el.classList.add('in'));
/* Gallery filter + lightbox */
const prints=$$('.print');
if(prints.length){
  $$('[data-f]').forEach(b=>b.onclick=()=>{$$('[data-f]').forEach(x=>x.classList.toggle('on',x===b));prints.forEach(t=>t.hidden=!(b.dataset.f==='all'||t.dataset.c===b.dataset.f))});
  const lb=$('.lb'),im=$('img',lb);let list=[],k=0;
  const show=()=>{im.src=list[k].dataset.img;im.alt=list[k].dataset.alt||''};
  const close=()=>{lb.classList.remove('open');document.body.style.overflow=''};
  const step=d=>{k=(k+d+list.length)%list.length;show()};
  prints.forEach(t=>$('.tile',t).addEventListener('click',()=>{if(!t.classList.contains('has'))return;
    list=prints.filter(x=>!x.hidden&&x.classList.contains('has')).map(x=>$('.slot',x));k=list.indexOf($('.slot',t));show();lb.classList.add('open');document.body.style.overflow='hidden'}));
  $('.x',lb).onclick=close;$('.p',lb).onclick=()=>step(-1);$('.nx',lb).onclick=()=>step(1);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)})}
/* Open / closed, India time, 6:30 am to 11:30 pm */
const st=$('#status');
if(st){const n=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));const m=n.getHours()*60+n.getMinutes(),open=m>=390&&m<1410;
  st.textContent=open?'Open now':'Closed now';st.classList.toggle('open',open)}
/* Form validation */
const f=$('#enquiry');
if(f)f.addEventListener('submit',e=>{e.preventDefault();let ok=true;
  const chk=(id,test,msg)=>{const el=$('#'+id),bad=!test(el.value.trim());$('#'+id+'-e').textContent=bad?msg:'';el.setAttribute('aria-invalid',bad);if(bad)ok=false};
  chk('name',v=>v.length>1,'Please enter your name.');
  chk('contact',v=>/^\S+@\S+\.\S+$/.test(v)||/^[+\d\s-]{8,}$/.test(v),'Enter a valid email or phone number.');
  chk('msg',v=>v.length>9,'Please write at least 10 characters.');
  if(ok){f.style.display='none';$('.thanks').style.display='block'}});
