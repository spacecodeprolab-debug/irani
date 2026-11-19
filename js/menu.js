/* Menu data. Edit prices here. [name, price, type(nv|v|egg), 1 = must try] */
const MENU=[
{c:"Non-Vegetarian",i:[["Butter Chicken",290,"nv"],["Chicken Masala",250,"nv"],["Mutton Bhuna",250,"nv"],["Mutton Korma",250,"nv"],["Kaleji Gurda",230,"nv"],["Bheja Masala",230,"nv",1],["Mutton Champ",240,"nv"],["Mutton Nalli Rosh",240,"nv"],["Dal Gosht",250,"nv"],["Mutton Keema",230,"nv",1],["Mutton Paya",240,"nv",1],["Fish Fry",140,"nv"],["Fish Masala",160,"nv"]]},
{c:"Eggiterian",n:"Egg Keema is prepared in chicken gravy.",i:[["Half Fried",45,"egg"],["Omelette",45,"egg"],["Bhurji",55,"egg"],["Egg Keema",85,"egg"]]},
{c:"Rice Selection",n:"Gravy of mutton or chicken on top of any rice dish is ₹10 extra.",i:[["Plain Rice",60,"v"],["Jeera Rice",70,"v"],["Masala Rice",70,"v"],["Egg Fried Rice",100,"egg"],["Chicken Fried Rice",150,"nv"],["Plain Khichdi",60,"v"],["Masala Khichdi",70,"v"]]},
{c:"Vegetarian",i:[["Sabji Fry",90,"v"],["Dal Fry",90,"v"],["Dal Fry Butter",110,"v"],["Kadhi",60,"v"],["Kadhi Fry",70,"v"]]},
{c:"Chapatis & Paratha",i:[["Chapati",12,"v"],["Butter Fry Chapati",25,"v"],["Desi Ghee Paratha",40,"v"]]},
{c:"Accompaniments",i:[["Papad (Fried / Roasted)",20,"v"],["Butter Milk",25,"v"]]},
{c:"Hot Beverages",i:[["Tea",35,"v",1],["Sulemani Tea",25,"v"],["Coffee",40,"v"],["Bournvita",40,"v"],["Milk Cup",40,"v"],["Milk Glass",40,"v"]]},
{c:"Buns & Butter",i:[["Muskabun",45,"v",1],["Nutella Muskabun",80,"v"],["Plain Bun",12,"v"],["Bakery Items (100 g)",40,"v"],["Desi Butter (100 g)",74,"v"],["Desi Ghee (1 kg)",780,"v"]]}
];
const slug=s=>s.toLowerCase().replace(/[^a-z]+/g,'-').replace(/-$/,'');
const root=document.getElementById('menu'),tabs=document.getElementById('tabs');
const LABEL={nv:'Non-vegetarian',v:'Vegetarian',egg:'Egg'};
let type='all',q='';
function render(){
  let any=false;root.innerHTML='';
  MENU.forEach(c=>{
    const its=c.i.filter(x=>(type==='all'||x[2]===type)&&x[0].toLowerCase().includes(q));
    if(!its.length)return;any=true;
    const s=document.createElement('section');s.className='cat';s.id=slug(c.c);
    s.innerHTML=`<h3>${c.c}</h3>${c.n?`<p class="nt">${c.n}</p>`:''}`+its.map(x=>`<div class="item"><span class="bd ${x[2]}" role="img" aria-label="${LABEL[x[2]]}"></span><span class="nm">${x[0]}${x[3]?'<span class="fav">MUST TRY</span>':''}</span><span class="ld"></span><span class="price">${x[1]}</span></div>`).join('');
    root.appendChild(s)});
  document.getElementById('empty').style.display=any?'none':'block';spy();
}
function spy(){
  if(!('IntersectionObserver'in window))return;if(spy.o)spy.o.disconnect();
  spy.o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)tabs.querySelectorAll('a').forEach(a=>{const on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('on',on);if(on)a.scrollIntoView({inline:'center',block:'nearest'})})}),{rootMargin:'-25% 0px -65% 0px'});
  root.querySelectorAll('.cat').forEach(s=>spy.o.observe(s));
}
tabs.innerHTML=MENU.map(c=>`<a href="#${slug(c.c)}">${c.c}</a>`).join('');
document.getElementById('search').addEventListener('input',e=>{q=e.target.value.toLowerCase().trim();render()});
document.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.type;document.querySelectorAll('[data-type]').forEach(x=>x.classList.toggle('on',x===b));render()}));
document.getElementById('print').addEventListener('click',()=>window.print());
render();
