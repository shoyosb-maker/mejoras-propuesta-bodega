/* ============================================================
   MAIN.JS · Navegación y tabs
   (Versión de presentación · sin aceptación ni checklist)
   ============================================================ */

const TABS = ['s1', 's2', 's3', 's4'];
const TAB_LABELS = {
  s1: 'Resumen ejecutivo',
  s2: 'Alcance y cronograma',
  s3: 'Impacto esperado',
  s4: 'Anexos técnicos'
};

let currentTab = 's1';

/* ===================== TABS ===================== */
const stepButtons = document.querySelectorAll('.step');
const tabPanels = document.querySelectorAll('.tab-panel');
const pageBadgeText = document.getElementById('pageBadgeText');
const floatPrev = document.getElementById('floatPrev');
const floatNext = document.getElementById('floatNext');

function activateTab(tabId, options = {}){
  if(!TABS.includes(tabId)) tabId = 's1';
  currentTab = tabId;

  stepButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  tabPanels.forEach(p => p.classList.toggle('active', p.id === tabId));

  const idx = TABS.indexOf(tabId);
  if(pageBadgeText){
    pageBadgeText.textContent = `Sección ${idx + 1} de ${TABS.length} · ${TAB_LABELS[tabId]}`;
  }
  if(floatPrev) floatPrev.disabled = idx === 0;
  if(floatNext) floatNext.disabled = idx === TABS.length - 1;

  if(options.updateHash !== false){
    history.replaceState(null, '', '#' + tabId);
  }
  if(options.scrollTo !== false){
    window.scrollTo({top:0, behavior:'smooth'});
  }
  setTimeout(() => {
    updateScrollSpy();
    observeAnimations();
  }, 80);
}

stepButtons.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
document.querySelectorAll('.nav-btn[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.goto));
});
if(floatPrev) floatPrev.addEventListener('click', () => {
  const idx = TABS.indexOf(currentTab);
  if(idx > 0) activateTab(TABS[idx - 1]);
});
if(floatNext) floatNext.addEventListener('click', () => {
  const idx = TABS.indexOf(currentTab);
  if(idx < TABS.length - 1) activateTab(TABS[idx + 1]);
});

/* ===================== TECLADO ===================== */
document.addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toLowerCase();
  if(tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

  if(e.key === 'ArrowLeft'){
    const idx = TABS.indexOf(currentTab);
    if(idx > 0){ e.preventDefault(); activateTab(TABS[idx - 1]); }
  } else if(e.key === 'ArrowRight'){
    const idx = TABS.indexOf(currentTab);
    if(idx < TABS.length - 1){ e.preventDefault(); activateTab(TABS[idx + 1]); }
  } else if(e.key === 'p' || e.key === 'P'){
    if(!e.ctrlKey && !e.metaKey && !e.altKey) window.print();
  } else if(e.key === 'Home'){
    if(!e.ctrlKey && !e.metaKey && !e.altKey){
      e.preventDefault();
      window.scrollTo({top:0, behavior:'smooth'});
    }
  }
});

/* ===================== SIDEBAR TOC ===================== */
document.querySelectorAll('aside.toc a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if(!href || !href.startsWith('#')) return;
    const targetId = href.substring(1);
    const targetEl = document.getElementById(targetId);
    if(!targetEl) return;

    const activePanel = document.querySelector('.tab-panel.active');
    if(activePanel && activePanel.contains(targetEl)){
      e.preventDefault();
      targetEl.scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      e.preventDefault();
      let targetTab = null;
      TABS.forEach(t => {
        const panel = document.getElementById(t);
        if(panel && panel.contains(targetEl)) targetTab = t;
      });
      if(targetTab){
        activateTab(targetTab, {scrollTo:false, updateHash:false});
        setTimeout(() => targetEl.scrollIntoView({behavior:'smooth', block:'start'}), 180);
      }
    }
  });
});

/* ===================== HASH INICIAL ===================== */
(function initFromHash(){
  const hash = window.location.hash.replace('#', '');
  if(TABS.includes(hash)){
    activateTab(hash, {scrollTo:false, updateHash:false});
    return;
  }
  if(hash){
    const targetEl = document.getElementById(hash);
    if(targetEl){
      let targetTab = null;
      TABS.forEach(t => {
        const panel = document.getElementById(t);
        if(panel && panel.contains(targetEl)) targetTab = t;
      });
      if(targetTab){
        activateTab(targetTab, {scrollTo:false, updateHash:false});
        setTimeout(() => targetEl.scrollIntoView({behavior:'smooth', block:'start'}), 180);
      }
    }
  }
})();

/* ===================== SCROLL SPY ===================== */
function updateScrollSpy(){
  const activePanel = document.querySelector('.tab-panel.active');
  if(!activePanel) return;
  const links = activePanel.querySelectorAll('aside.toc a');
  if(!links.length) return;

  const targets = [...links].map(a => {
    const href = a.getAttribute('href');
    return href && href.startsWith('#') ? activePanel.querySelector(href) : null;
  }).filter(Boolean);
  if(!targets.length) return;

  const scrollY = window.scrollY + 140;
  let current = targets[0];
  for(const t of targets){
    if(t.offsetTop <= scrollY) current = t;
  }
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
}
window.addEventListener('scroll', updateScrollSpy, {passive:true});

/* ===================== ANIMACIONES ===================== */
let observer;
function observeAnimations(){
  const activePanel = document.querySelector('.tab-panel.active');
  if(!activePanel) return;
  if(observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.08});

  activePanel.querySelectorAll('.impact-card, .kpi, .intangible, .vc-step, .module-card, .compare-col, .card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}

/* ===================== INIT ===================== */
updateScrollSpy();
observeAnimations();