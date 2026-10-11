/* ===================== EDIT THIS PART ===================== */
const CONFIG = {
  password: "200926", // tukar password di sini
  letter: `babyyy gatauuuu giamanaa mauuu susun semua benda yang babyyy rasa dalam satu surat.

Tapi hari ini babyyyy cuma mauuuu sayanggg tahu yang babyyy bersyukur bangettttt sebab sayanggg hadir dalam hidup babyyy. Terima kasih untuk semua tawa dan canda, semua cerita, semua masa yang kita luangkan bersama, dan juga semua perkara kecil yang mungkin kamuuu enggaa sedar sebenarnya sangat bermakna untuk akuuuuu.

Semoga umur baru ini bawaaa lebihhh banyakkkk bahagia, rezeki, ketenangan dan perkara-perkara baik untuk kamu. Kalau ada hari yang terasa berat, aku harap kamu ingat yang kamu gaperlu hadap semuanya sendiriann sayangg...kamuuu kann udahh punyaa akuu jadii akuu siapp untuk dengar ceritaa kamuu sama adaa ceritaa sedihh atauu gembiraaa.

Happy birthday, my favorite person. 💗`,
  finalMessage: `Terima kasih sebab jadi salah satu bahagian paling indah dalam hidup babyyyy. Semoga semua yang sayangggg impikan perlahan-lahan menjadi kenyataan. Aku harap hari ini buat kamu rasa disayangi, dihargai dan sangat istimewa. Happy birthday sayangkuuuuuuuuuuu...MUAHHHH! 🎂💗`
};
/* ========================================================== */

const pages = [...document.querySelectorAll('.page')];
const dots = [...document.querySelectorAll('.dot')];
let current = 0;

function goTo(index){
  index = Math.max(0, Math.min(pages.length - 1, index));
  pages.forEach((p,i)=>p.classList.toggle('active', i===index));
  dots.forEach((d,i)=>d.classList.toggle('active', i===index));
  current=index;
}

dots.forEach(d=>d.addEventListener('click',()=>goTo(+d.dataset.go)));
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>goTo(+b.dataset.next)));

// floating hearts
const hearts=document.getElementById('hearts');
const heartChars=['♥','♡','❤','✦','✿'];
for(let i=0;i<36;i++){
  const el=document.createElement('span'); el.className='heart'; el.textContent=heartChars[Math.floor(Math.random()*heartChars.length)];
  el.style.left=Math.random()*100+'%'; el.style.top=(Math.random()*110+5)+'%';
  el.style.fontSize=(8+Math.random()*17)+'px'; el.style.animationDuration=(10+Math.random()*18)+'s';
  el.style.animationDelay=(-Math.random()*25)+'s'; el.style.opacity=(.15+Math.random()*.35);
  hearts.appendChild(el);
}

// opening envelope
const envelope=document.getElementById('openEnvelope');
envelope.addEventListener('click',()=>{
  envelope.classList.add('open');
  setTimeout(()=>goTo(1),650);
});

// diary password flow
const diaryModal=document.getElementById('diaryModal');
const passwordModal=document.getElementById('passwordModal');
const letterText=document.getElementById('letterText');
letterText.textContent=CONFIG.letter;
document.getElementById('finalMessage').textContent=CONFIG.finalMessage;

document.getElementById('diaryBtn').addEventListener('click',()=>{
  passwordModal.classList.add('show'); passwordModal.setAttribute('aria-hidden','false');
  setTimeout(()=>document.getElementById('passwordInput').focus(),150);
});
function unlock(){
  const input=document.getElementById('passwordInput');
  const err=document.getElementById('passwordError');
  if(input.value===CONFIG.password){
    err.classList.remove('error'); input.value=''; passwordModal.classList.remove('show');
    setTimeout(()=>{diaryModal.classList.add('show');diaryModal.setAttribute('aria-hidden','false')},180);
  }else{err.classList.add('error'); input.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:220});}
}
document.getElementById('unlockBtn').addEventListener('click',unlock);
document.getElementById('passwordInput').addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});

document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{
  const m=document.getElementById(b.dataset.close); m.classList.remove('show');m.setAttribute('aria-hidden','true');
}));
document.querySelectorAll('.modal-backdrop').forEach(b=>b.addEventListener('click',()=>b.parentElement.classList.remove('show')));

// draggable photo stack: throw current top card to reveal next
const stack=document.getElementById('photoStack');
let topCard=null,startX=0,startY=0,dragging=false;
function refreshStack(){
  const cards=[...stack.querySelectorAll('.polaroid')];
  cards.forEach((c,i)=>{c.style.zIndex=cards.length-i;c.style.opacity='1';});
}
function startDrag(e){
  const cards=[...stack.querySelectorAll('.polaroid')]; if(!cards.length)return;
  topCard=cards[0]; // DOM order is continuously moved
  dragging=true; topCard.classList.add('dragging');
  const p=e.touches?e.touches[0]:e; startX=p.clientX;startY=p.clientY;
}
function moveDrag(e){if(!dragging||!topCard)return;const p=e.touches?e.touches[0]:e;const dx=p.clientX-startX,dy=p.clientY-startY;topCard.style.transform=`translate(calc(-50% + ${dx}px), ${dy}px) rotate(${dx*.08}deg)`;}
function endDrag(e){if(!dragging||!topCard)return;dragging=false;topCard.classList.remove('dragging');const m=/translate\(calc\(-50% \+ (-?\d+(?:\.\d+)?)px\),/.exec(topCard.style.transform);const dx=m?+m[1]:0;
  if(Math.abs(dx)>80){topCard.style.transition='transform .35s ease, opacity .35s';topCard.style.transform=`translate(calc(-50% + ${dx>0?600:-600}px), 30px) rotate(${dx>0?25:-25}deg)`;topCard.style.opacity='0';setTimeout(()=>{stack.appendChild(topCard);topCard.style.transition='';topCard.style.transform='';refreshStack()},360)}else{topCard.style.transform='';}
}
stack.addEventListener('pointerdown',startDrag);window.addEventListener('pointermove',moveDrag);window.addEventListener('pointerup',endDrag);

// cake knife
const track=document.getElementById('knifeTrack'), knife=track.querySelector('.knife');
let knifeDrag=false;
knife.addEventListener('pointerdown',e=>{knifeDrag=true;knife.setPointerCapture(e.pointerId)});
knife.addEventListener('pointermove',e=>{if(!knifeDrag)return;const r=track.getBoundingClientRect();let x=e.clientX-r.left-21;x=Math.max(4,Math.min(r.width-46,x));knife.style.left=x+'px';if(x>r.width-60){track.classList.add('cut');cakeConfetti()}});
knife.addEventListener('pointerup',()=>knifeDrag=false);
function cakeConfetti(){for(let i=0;i<24;i++){const s=document.createElement('span');s.textContent=['♥','✦','✿','✨'][i%4];s.style.cssText=`position:fixed;left:${45+Math.random()*10}%;top:${48+Math.random()*10}%;z-index:200;font-size:${10+Math.random()*16}px;color:${['#ed3d78','#f4c72b','#f58db0'][i%3]};pointer-events:none;animation:confetti 900ms ease-out forwards`;document.body.appendChild(s);setTimeout(()=>s.remove(),950)}}
const st=document.createElement('style');st.textContent='@keyframes confetti{to{transform:translate('+(Math.random()>0.5?'':'-')+'220px,-'+(100+Math.random()*240)+'px) rotate(300deg);opacity:0}}';document.head.appendChild(st);

// gift
const giftModal=document.getElementById('giftModal');
document.getElementById('giftBtn').addEventListener('click',()=>{giftModal.classList.add('show');giftModal.setAttribute('aria-hidden','false');});

// keyboard navigation
window.addEventListener('keydown',e=>{if(e.key==='ArrowRight' && !document.querySelector('.modal.show'))goTo(current+1);if(e.key==='ArrowLeft'&&!document.querySelector('.modal.show'))goTo(current-1);if(e.key==='Escape')document.querySelectorAll('.modal.show').forEach(m=>m.classList.remove('show'))});

refreshStack();
