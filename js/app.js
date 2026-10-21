/* Countdown, popups, confetti, photo fallback. Edit texts in js/content.js */
const $=id=>document.getElementById(id);
const REAL=new Date(...CONTENT.birthday).getTime(), WINDOW=30*864e5;
let preview=false, override=null, celebrated=false, tapped=false;
let heart=null;try{heart=confetti.shapeFromText({text:'🩷',scalar:2})}catch(e){}

function pop(o){try{window.confetti&&confetti(Object.assign({particleCount:90,spread:75,origin:{y:.65},colors:SKINS[skin].confetti,shapes:heart?[heart,'circle']:['circle','square'],scalar:heart?2:1},o||{}))}catch(e){}}
function party(){
  const end=Date.now()+4500;
  (function f(){pop({particleCount:5,angle:60,spread:60,origin:{x:0,y:.8}});pop({particleCount:5,angle:120,spread:60,origin:{x:1,y:.8}});if(Date.now()<end)requestAnimationFrame(f)})();
  pop({particleCount:170,spread:120,origin:{y:.55}});
  if(tapped&&!playing)toggleMusic();
}
function setNum(id,v){const e=$(id);if(e.textContent!==v){e.textContent=v;e.classList.remove('tick');void e.offsetWidth;e.classList.add('tick')}}
function render(){
  const diff=(override??REAL)-Date.now(), done=diff<=0, open=preview||done, fin=!preview&&!done&&diff<=10000;
  document.body.classList.toggle('open',open);
  $('final').classList.toggle('on',fin);
  if(fin){const n=String(Math.ceil(diff/1000)),e=$('fn');if(e.textContent!==n){e.textContent=n;e.classList.remove('zoom');void e.offsetWidth;e.classList.add('zoom')}}
  if(open){
    $('bar').firstElementChild.style.width='100%';
    if(!celebrated){celebrated=true;done?party():pop()}
    return;
  }
  celebrated=false;
  const p=n=>String(n).padStart(2,'0');
  setNum('d',p(Math.floor(diff/864e5)));setNum('h',p(Math.floor(diff%864e5/36e5)));
  setNum('m',p(Math.floor(diff%36e5/6e4)));setNum('s',p(Math.floor(diff%6e4/1e3)));
  $('bar').firstElementChild.style.width=(1-Math.min(diff,WINDOW)/WINDOW)*100+'%';
}
function setMode(m){
  preview=m===1;override=m===2?Date.now()+14000:null;
  [0,1,2].forEach(i=>$('b'+i).classList.toggle('on',i===m));
  if(m!==1)stopMusic();
  celebrated=false;render();
}
let tt;function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2200)}

document.addEventListener('pointerdown',()=>tapped=true,{once:true});
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-gift]');
  if(g){
    if(!document.body.classList.contains('open')){g.classList.remove('shake');void g.offsetWidth;g.classList.add('shake');toast('Not yet — unlocks at midnight 🎁');return}
    $(g.dataset.gift).classList.add('on');return;
  }
  if(e.target.closest('[data-close]')||e.target.classList.contains('ov'))e.target.closest('.ov').classList.remove('on');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.ov.on').forEach(o=>o.classList.remove('on'))});
document.addEventListener('gesturestart',e=>e.preventDefault());

let wl=null;
async function keepAwake(){try{if('wakeLock' in navigator&&!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>wl=null)}}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)keepAwake()});
document.addEventListener('click',keepAwake,{once:true});keepAwake();

const candles=[...document.querySelectorAll('.candle')];
function checkWish(){const all=candles.every(c=>c.firstElementChild.classList.contains('out'));$('wish').style.display=all?'block':'none';return all}
candles.forEach(c=>c.onclick=()=>{const f=c.firstElementChild;if(f.classList.contains('out'))return;f.classList.add('out');if(checkWish())pop()});
$('relight').onclick=()=>{candles.forEach(c=>c.firstElementChild.classList.remove('out'));checkWish()};

const reasons=CONTENT.reasons;
let ri=0;
function showReason(){$('rn').textContent=ri+1;$('rt').textContent=reasons[ri];$('rbar').style.width=(ri+1)/reasons.length*100+'%';const c=$('rc');c.style.animation='none';void c.offsetWidth;c.style.animation='up .3s ease'}
function step(n){ri=(ri+n+reasons.length)%reasons.length;showReason()}
showReason();
let sx=null;const rc=$('rc');
rc.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
rc.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)step(dx<0?1:-1);sx=null});

let tried=false;
async function fallback(){
  if(tried)return;tried=true;
  try{
    let r=await fetch('IMG_0147.HEIC');if(!r.ok)r=await fetch('IMG_0147.heic');
    if(!r.ok||!window.heic2any)throw 0;
    const b=await heic2any({blob:await r.blob(),toType:'image/jpeg',quality:.85});
    const u=URL.createObjectURL(b);document.querySelectorAll('.her-photo').forEach(i=>i.src=u);
  }catch(e){document.querySelectorAll('.ph').forEach(p=>p.classList.add('nophoto'))}
}
document.querySelectorAll('.her-photo').forEach(i=>{i.onerror=fallback;if(i.complete&&i.naturalWidth===0)fallback()});


render();setInterval(render,250);
window.addEventListener('load',()=>setTimeout(pop,500));

// Fill the letter + polaroid back from js/content.js
function fillContent(){
  const L=CONTENT.letter;
  $('letterBody').innerHTML=L.paragraphs.map((t,i)=>'<p>'+(i===0?'<strong>'+t+'</strong>':t)+'</p>').join('')+'<p class="sign">'+L.signoff+'</p>';
  $('flipDate').textContent=CONTENT.flip.date;
  $('flipMsg').textContent='\u201c'+CONTENT.flip.message+'\u201d';
}
fillContent();
