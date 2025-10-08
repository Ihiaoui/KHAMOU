/* ===== KHAMOU-TEAM — Frontend interactive script (vanilla) ===== */

// ---------- helpers ----------
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const toast = (txt)=> {
  const el = qs('#toast');
  el.textContent = txt; el.style.opacity = 1; el.style.transform='translateY(0)';
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>{ el.style.opacity=0; el.style.transform='translateY(12px)'; }, 2200);
};

// ---------- theme ----------
const themeToggle = qs('#themeToggle');
const setTheme = (dark) => {
  if(dark){ document.body.classList.add('dark'); localStorage.setItem('k_theme','dark'); }
  else{ document.body.classList.remove('dark'); localStorage.removeItem('k_theme'); }
};
themeToggle.addEventListener('click', ()=>{
  setTheme(!document.body.classList.contains('dark'));
});
if(localStorage.getItem('k_theme')==='dark') setTheme(true);

// ---------- auth (local simulation) ----------
const nameInput = qs('#nameInput');
const emailInput = qs('#emailInput');
const btnLogin = qs('#btnLogin');
const btnClear = qs('#btnClear');
const userNameSpan = qs('#userName');
const logoutBtn = qs('#logoutBtn');

function setLocalUser(u){
  if(!u){ localStorage.removeItem('k_user'); userNameSpan.textContent='ضيف'; qs('#logoutBtn').classList.add('hide'); qs('#authBox').style.display='block'; return; }
  localStorage.setItem('k_user', JSON.stringify(u));
  userNameSpan.textContent = u.name || 'مستخدم';
  qs('#logoutBtn').classList.remove('hide');
  qs('#authBox').style.display='none';
}
btnLogin.onclick = ()=>{
  const name = nameInput.value.trim() || 'ضيف';
  const email = emailInput.value.trim() || '';
  setLocalUser({name, email});
  toast('أهلاً '+ (name || 'ضيف') );
};
btnClear.onclick = ()=>{ nameInput.value=''; emailInput.value=''; localStorage.removeItem('k_user'); setLocalUser(null); toast('تم المسح'); };
logoutBtn.onclick = ()=>{ setLocalUser(null); toast('تم تسجيل الخروج'); }

// restore
const saved = JSON.parse(localStorage.getItem('k_user') || 'null');
if(saved) setLocalUser(saved);

// ---------- sidebar navigation ----------
qsa('.side-item').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    qsa('.side-item').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const section = btn.dataset.section;
    showSection(section);
  });
});
function showSection(id){
  qsa('.section').forEach(s=>s.classList.remove('active'));
  const el = qs('#'+id);
  if(el){ el.classList.add('active'); el.scrollIntoView({behavior:'smooth', block:'center'}); }
}

// ---------- counters animation ----------
function animateValue(el, start, end, duration=900){
  const node = (typeof el === 'string') ? qs(el) : el;
  let startTime = null;
  function step(timestamp){
    if(!startTime) startTime = timestamp;
    const progress = Math.min((timestamp-startTime)/duration,1);
    const value = Math.floor(start + (end-start)*progress);
    node.textContent = value;
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
// sample numbers (for demo)
const total = parseInt(localStorage.getItem('k_total') || '475');
const completed = parseInt(localStorage.getItem('k_completed') || '312');
animateValue('#totalVisitors', 0, total, 900);
animateValue('#completedVisitors', 0, completed, 900);

// ---------- chat (localStorage simulation) ----------
const chatBox = qs('#chatBox');
const chatInput = qs('#chatInput');
const chatSend = qs('#chatSend');
function loadChat(){
  const arr = JSON.parse(localStorage.getItem('k_chat') || '[]');
  chatBox.innerHTML = '';
  arr.forEach(m => {
    const el = document.createElement('div');
    el.className = 'chat-msg';
    el.innerHTML = `<b>${escapeHtml(m.user)}</b><div class="msg-text">${escapeHtml(m.text)}</div><div class="msg-time">${new Date(m.t).toLocaleTimeString()}</div>`;
    chatBox.appendChild(el);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
chatSend.onclick = ()=>{
  const text = chatInput.value.trim();
  if(!text) return;
  const user = JSON.parse(localStorage.getItem('k_user') || 'null') || {name:'ضيف'};
  const arr = JSON.parse(localStorage.getItem('k_chat') || '[]');
  arr.push({user:user.name, text, t:Date.now()});
  localStorage.setItem('k_chat', JSON.stringify(arr));
  chatInput.value='';
  loadChat();
};
loadChat();

// ---------- image gallery ----------
const images = [
  'https://picsum.photos/id/1015/600/400',
  'https://picsum.photos/id/1025/600/400',
  'https://picsum.photos/id/1035/600/400',
  'https://picsum.photos/id/1045/600/400',
  'https://picsum.photos/id/1055/600/400',
  'https://picsum.photos/id/1065/600/400'
];
const imageGrid = qs('#imageGrid');
function renderImages(){
  imageGrid.innerHTML = '';
  images.forEach((src,i)=>{
    const item = document.createElement('div'); item.className='image-item';
    item.innerHTML = `<img src="${src}" alt="image-${i}"><div class="img-actions"><button onclick="downloadImage(${i})">تحميل</button></div>`;
    imageGrid.appendChild(item);
  });
}
window.downloadImage = function(i){
  const url = images[i];
  const a = document.createElement('a');
  a.href = url; a.download = `khamou_image_${i}.jpg`;
  document.body.appendChild(a); a.click(); a.remove();
  toast('بدأ تحميل الصورة');
}
renderImages();

// ---------- texts list ----------
const texts = [
  {title:'نص ترويجي 1', text:'هذا مثال لنص ترويجي جاهز للاستخدام في صفحات الهبوط.'},
  {title:'نص دعائي 2', text:'نسخة قصيرة وقوية يمكنك نسخها ونشرها مباشرة.'},
  {title:'تغريدة جاهزة', text:'أفكار ونصوص جاهزة للتواصل الاجتماعي.'},
];
const textList = qs('#textList');
function renderTexts(){
  textList.innerHTML='';
  texts.forEach((t,i)=>{
    const card = document.createElement('div'); card.className='text-card';
    card.innerHTML = `<div><strong>${t.title}</strong><p>${t.text}</p></div><div><button onclick="copyText(${i})">نسخ</button></div>`;
    textList.appendChild(card);
  });
}
window.copyText = function(i){
  navigator.clipboard.writeText(texts[i].text).then(()=>{
    toast('تم نسخ النص');
  }).catch(()=>{ toast('نسخ غير متاح'); });
}
renderTexts();

// ---------- link shortener (local simulation) ----------
const shortenBtn = qs('#shortenBtn');
const urlInput = qs('#urlInput');
const shortResult = qs('#shortResult');
const copyShort = qs('#copyShort');

shortenBtn.onclick = ()=>{
  const url = urlInput.value.trim();
  if(!url){ toast('ضع رابطاً صحيحاً'); return; }
  const slug = Math.random().toString(36).substring(2,8);
  const mapping = JSON.parse(localStorage.getItem('k_shorts')||'{}');
  mapping[slug] = url;
  localStorage.setItem('k_shorts', JSON.stringify(mapping));
  // present a hosted-looking short link (will work when deployed to your domain)
  const origin = location.origin + location.pathname.replace(/\/[^\/]*$/, '');
  const short = `${origin}/s/${slug}`;
  shortResult.textContent = short;
  copyShort.classList.remove('hide');
  copyShort.onclick = ()=>{ navigator.clipboard.writeText(short).then(()=>toast('تم نسخ الرابط المختصر')) };
};

// ---------- settings -->
qs('#clearData').onclick = ()=>{
  if(confirm('هل تريد تفريغ بيانات المحاكاة (الشات والاختصارات)؟')){
    localStorage.removeItem('k_chat'); localStorage.removeItem('k_shorts'); toast('تم تفريغ البيانات'); loadChat();
  }
};
qs('#exportData').onclick = ()=>{
  const data = {
    user: JSON.parse(localStorage.getItem('k_user')||'null'),
    chat: JSON.parse(localStorage.getItem('k_chat')||'[]'),
    shorts: JSON.parse(localStorage.getItem('k_shorts')||'{}')
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  a.download = 'khamou-data.json'; document.body.appendChild(a); a.click(); a.remove();
  toast('تم تصدير البيانات');
};

// small accessibility: press Enter to send chat
chatInput.addEventListener('keydown', e=>{ if(e.key==='Enter') chatSend.click(); });

// initialize UI
showSection('visitor');
