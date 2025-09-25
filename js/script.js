/* Utilitaires DOM */
const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => Array.from(c.querySelectorAll(q));

/* Etat persistant */
const store = {
  get: (k, d = null) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k)
};

document.addEventListener('DOMContentLoaded', () => {
  // Année footer
  $('#year').textContent = new Date().getFullYear();

  // Navigation mobile
  const navToggle = $('.nav-toggle');
  const navList = $('#navList');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#navList a').forEach(a => a.addEventListener('click', () => navList.classList.remove('open')));
  }

  // Smooth scroll
  $$('#navList a, a.btn, .list a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      a.addEventListener('click', e => {
        const el = $(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });

  // Thème sombre
  const themeToggle = $('#themeToggle');
  const savedTheme = store.get('theme', 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const curr = document.documentElement.getAttribute('data-theme');
      const next = curr === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      store.set('theme', next);
    });
  }

  // Internationalisation (FR/EN simplifiée)
  const langToggle = $('#langToggle');
  const i18n = {
    fr: {
      nav_home: "Accueil", nav_services:"Services", nav_work:"Réalisations", nav_pricing:"Tarifs", nav_testimonials:"Avis", nav_faq:"FAQ", nav_blog:"Blog", nav_contact:"Contact",
      cta_quote:"Obtenir un devis", cta_call:"Appeler maintenant",
      hero_title:"Votre site pro, rapide et rentable",
      hero_sub:"Nous créons des sites internet pour artisans, commerçants et TPE près de chez vous. Conçus pour convertir, faciles à gérer, optimisés pour le SEO local.",
      hero_b1:"Devis instantané et transparent", hero_b2:"Livraison en 10 à 15 jours", hero_b3:"Maintenance et accompagnement",
      services_title:"Nos services", services_intro:"Des offres claires pour démarrer vite et bien, avec l’essentiel pour être trouvé et convertir.",
      process_title:"Notre méthode",
      work_title:"Réalisations",
      pricing_title:"Tarifs clairs",
      quote_title:"Devis instantané",
      testi_title:"Ils recommandent",
      faq_title:"Questions fréquentes",
      blog_title:"Ressources & conseils",
      contact_title:"Contact",
      trust:"De nombreux commerces et artisans nous font confiance",
      audit_label:"Lien de votre site (si existant)", audit_btn:"Recevoir un mini‑audit gratuit", audit_small:"Réponse sous 24h par email."
    },
    en: {
      nav_home:"Home", nav_services:"Services", nav_work:"Work", nav_pricing:"Pricing", nav_testimonials:"Reviews", nav_faq:"FAQ", nav_blog:"Blog", nav_contact:"Contact",
      cta_quote:"Get a quote", cta_call:"Call now",
      hero_title:"Your fast, profitable business website",
      hero_sub:"We build high‑converting websites for local small businesses. Easy to manage, optimized for local SEO.",
      hero_b1:"Instant, transparent quote", hero_b2:"Delivery within 10–15 days", hero_b3:"Maintenance & support",
      services_title:"Our services", services_intro:"Clear packages to start quickly with everything you need to be found and convert.",
      process_title:"Our process",
      work_title:"Portfolio",
      pricing_title:"Transparent pricing",
      quote_title:"Instant quote",
      testi_title:"Clients recommend us",
      faq_title:"Frequently asked questions",
      blog_title:"Resources & tips",
      contact_title:"Contact",
      trust:"Trusted by many local shops and craftsmen",
      audit_label:"Your website URL (if any)", audit_btn:"Get a free mini‑audit", audit_small:"Reply within 24h by email."
    }
  };
  let lang = store.get('lang', 'fr');
  applyLang(lang);
  langToggle.textContent = lang.toUpperCase();
  langToggle.addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    applyLang(lang);
    store.set('lang', lang);
    langToggle.textContent = lang.toUpperCase();
    document.documentElement.lang = lang;
  });
  function applyLang(code){
    document.documentElement.lang = code;
    $$('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if (i18n[code][key]) el.textContent = i18n[code][key];
    });
  }

  // Audit form: mailto simple
  $('#auditForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const url = $('#auditUrl').value.trim();
    const subject = encodeURIComponent('Demande de mini‑audit');
    const body = encodeURIComponent(`Bonjour,\n\nVoici l’URL à auditer : ${url || '—'}\n\nObjectifs :\n- Visibilité locale\n- Conversion\n\nMerci !`);
    window.location.href = `mailto:bonjour@weblocal.fr?subject=${subject}&body=${body}`;
  });

  // Portfolio: filtre + modal
  const chips = $$('.chip');
  const items = $$('.portfolio-grid .card.media');
  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;
      items.forEach(it=>{
        it.style.display = (f==='all' || it.dataset.cat===f)?'block':'none';
      });
    });
  });
  items.forEach(fig=>{
    fig.addEventListener('click', ()=>{
      const dlg = $('#portfolioModal');
      $('#pmTitle').textContent = $('figcaption', fig).textContent;
      $('#pmImg').src = $('img', fig).src;
      $('#pmImg').alt = $('img', fig).alt;
      $('#pmDesc').textContent = "Objectifs: visibilité locale, notoriété, conversions. Stack: HTML/CSS/JS.";
      const tags = ['SEO local','Responsive','Performance'];
      const ul = $('#pmTags'); ul.innerHTML='';
      tags.forEach(t=>{const s=document.createElement('span');s.textContent=t;ul.append(s);});
      dlg.showModal();
    });
  });
  $$('#portfolioModal .modal-close').forEach(b=>b.addEventListener('click',()=>$('#portfolioModal').close()));

  // Pricing toggle: achat vs abonnement (ex: /mois sur 24 mois)
  const billingToggle = $('#billingToggle');
  const amounts = $$('[data-amount]');
  const periods = $$('.price-period');
  billingToggle?.addEventListener('change', ()=>{
    const sub = billingToggle.checked;
    amounts.forEach((el)=>{
      const base = Number(el.dataset.amount);
      if (sub){
        const monthly = Math.round((base*1.15) / 24); // 15% frais + mensualisé 24 mois
        el.textContent = `${monthly}€`;
      } else {
        el.textContent = `${base}€`;
      }
    });
    periods.forEach(p=>p.textContent = sub?'/mois':'/unique');
  });

  // Ouvrir devis depuis cartes
  $$('.open-quote').forEach(btn => btn.addEventListener('click', () => {
    $('#quote').scrollIntoView({behavior:'smooth'});
  }));

  // Devis interactif
  const qf = $('#quoteForm');
  const pages = $('#pages');
  const pagesOut = $('#pagesOut');
  pages.addEventListener('input', ()=> pagesOut.textContent = pages.value);
  qf.addEventListener('input', updateEstimate);
  updateEstimate();

  function updateEstimate(){
    const fd = new FormData(qf);
    const type = fd.get('type');
    const nPages = Number(fd.get('pages') || 1);

    // Barème simple (indicatif)
    let base = { vitrine: 900, ecommerce: 2300, reservation: 1500 }[type] || 900;
    let pageCost = 90 * Math.max(0, nPages - 3);
    let total = base + pageCost;

    const add = [];
    if (fd.get('blog')) { total += 250; add.push('Blog'); }
    if (fd.get('multi')) { total += 350; add.push('Multilingue'); }
    if (fd.get('seo')) { total += 400; add.push('SEO avancé'); }
    if (fd.get('maintenance')) { total += 25*12; add.push('Maintenance (1 an)'); }
    if (fd.get('content')) { total += 80 * Math.max(3, nPages); add.push('Rédaction'); }
    if (fd.get('brand')) { total += 390; add.push('Identité visuelle'); }

    const design = fd.get('design');
    if (design === 'premium') { total *= 1.15; add.push('Design premium'); }
    if (design === 'surmesure') { total *= 1.35; add.push('Design sur‑mesure'); }

    const rush = fd.get('rush');
    if (rush === 'rapide') { total *= 1.10; add.push('Délai rapide'); }
    if (rush === 'urgent') { total *= 1.25; add.push('Urgence'); }

    total = Math.round(total);
    $('#estTotal').textContent = `${total} €`;
    $('#estDetail').textContent = `${type} · ${nPages} pages${add.length? ' · '+add.join(', '):''}`;

    // Stocker devis courant
    store.set('lastQuote', { when: new Date().toISOString(), total, type, nPages, add });
  }

  // Actions devis
  $('#sendQuote').addEventListener('click', ()=>{
    if (!qf.reportValidity()) return;
    const fd = new FormData(qf);
    const spam = fd.get('website'); if (spam) return;
    const est = $('#estTotal').textContent;
    const detail = $('#estDetail').textContent;
    const subject = encodeURIComponent(`Demande de devis — ${est}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nJe souhaite obtenir un devis.\n\nDétails:\n${detail}\nEstimation: ${est}\n\nNom: ${fd.get('name')}\nEmail: ${fd.get('email')}\nTéléphone: ${fd.get('phone')||'—'}\n\nMessage:\n${fd.get('message')||'—'}\n`
    );
    window.location.href = `mailto:bonjour@weblocal.fr?subject=${subject}&body=${body}`;
  });

  $('#downloadQuote').addEventListener('click', ()=>{
    const q = store.get('lastQuote');
    if (!q) return;
    const content = `Devis WebLocal\nDate: ${new Date().toLocaleString()}\nTotal: ${q.total} €\nType: ${q.type}\nPages: ${q.nPages}\nOptions: ${(q.add||[]).join(', ')||'—'}`;
    downloadText('devis-weblocal.txt', content);
  });

  $('#printQuote').addEventListener('click', ()=> window.print());

  // Témoignages: navigation
  const track = $('#testiTrack');
  $('.carousel .next').addEventListener('click', ()=> track.scrollBy({left:300,behavior:'smooth'}));
  $('.carousel .prev').addEventListener('click', ()=> track.scrollBy({left:-300,behavior:'smooth'}));

  // Blog: articles démo + recherche + modal
  const blogPosts = [
    {id:1, title:"Checklist SEO local pour TPE", date:"2025-06-12", tags:["SEO","Local"], content:"Optimisez votre fiche Google Business, récoltez des avis, structurez vos pages services par ville…"},
    {id:2, title:"Site vitrine: 10 sections qui convertissent", date:"2025-04-20", tags:["Design","Conversion"], content:"Héros clair, preuves sociales, appels à l’action, FAQ, contact facile, etc."},
    {id:3, title:"RGPD: les bases pour votre site", date:"2025-02-08", tags:["RGPD","Légal"], content:"Mention de politique de confidentialité, bannière cookies, consentement, registre des traitements…"}
  ];
  const blogList = $('#blogList');
  renderPosts(blogPosts);
  $('#blogSearch').addEventListener('input', e=>{
    const q = e.target.value.toLowerCase();
    const filtered = blogPosts.filter(p=> p.title.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q) );
    renderPosts(filtered);
  });
  function renderPosts(list){
    blogList.innerHTML='';
    list.forEach(p=>{
      const art = document.createElement('article');
      art.className='card';
      art.innerHTML = `
        <h3>${p.title}</h3>
        <p class="blog-meta">${new Date(p.date).toLocaleDateString()} • ${p.tags.join(', ')}</p>
        <p>${p.content.substring(0,120)}…</p>
        <div><button class="btn btn-ghost" data-open="${p.id}">Lire</button></div>
      `;
      blogList.append(art);
    });
    $$('[data-open]').forEach(b=> b.addEventListener('click', ()=>{
      const id = Number(b.getAttribute('data-open'));
      const post = blogPosts.find(x=>x.id===id);
      if(!post) return;
      $('#blogTitle').textContent = post.title;
      $('#blogMeta').textContent = `${new Date(post.date).toLocaleDateString()} • ${post.tags.join(', ')}`;
      $('#blogContent').innerHTML = `<p>${post.content}</p>`;
      $('#blogModal').showModal();
    }));
  }
  $$('#blogModal .modal-close').forEach(b=>b.addEventListener('click',()=>$('#blogModal').close()));

  // Contact: validation + mailto fallback
  $('#contactForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    if (!e.target.reportValidity()) return;
    if (fd.get('company')) return; // honeypot
    const subject = encodeURIComponent(`${fd.get('subject')} — ${fd.get('name')}`);
    const body = encodeURIComponent(`Nom: ${fd.get('name')}\nEmail: ${fd.get('email')}\nTéléphone: ${fd.get('phone')||'—'}\n\nMessage:\n${fd.get('message')}`);
    window.location.href = `mailto:bonjour@weblocal.fr?subject=${subject}&body=${body}`;
    $('#contactMsg').textContent = 'Votre logiciel email vient de s’ouvrir. Si ce n’est pas le cas, écrivez‑nous à bonjour@weblocal.fr';
  });

  // Mini-scheduler: créneaux 2 semaines, 9h-17h
  const scheduleGrid = $('#scheduleGrid');
  const booked = store.get('booked', {}); // { "2025-09-28T10:00": true }
  renderSlots();
  function renderSlots(){
    scheduleGrid.innerHTML='';
    const now = new Date();
    for(let d=0; d<14; d++){
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate()+d);
      // jours ouvrés
      if (day.getDay() === 0 || day.getDay() === 6) continue;
      // 9h à 17h toutes les 2h
      for(let h=9; h<=17; h+=2){
        const dt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, 0, 0);
        const id = dt.toISOString().slice(0,16);
        const btn = document.createElement('button');
        btn.className = 'slot';
        btn.textContent = `${dt.toLocaleDateString()} ${h}:00`;
        btn.disabled = booked[id] ? true : false;
        if (booked[id]) btn.classList.add('booked');
        btn.addEventListener('click', ()=>{
          if (confirm(`Confirmer le créneau du ${btn.textContent} ?`)) {
            booked[id] = true; store.set('booked', booked); renderSlots();
            const subject = encodeURIComponent('Prise de rendez-vous');
            const body = encodeURIComponent(`Bonjour,\n\nJe souhaite réserver le créneau du ${btn.textContent}.\n\nMerci.`);
            window.location.href = `mailto:bonjour@weblocal.fr?subject=${subject}&body=${body}`;
          }
        });
        scheduleGrid.append(btn);
      }
    }
  }

  // VCF (contact)
  $('#downloadVcf').addEventListener('click', ()=>{
    const vcf = `BEGIN:VCARD
VERSION:3.0
N:;WebLocal;;;
FN:WebLocal
ORG:WebLocal
TEL;TYPE=CELL:+33600000000
EMAIL:bonjour@weblocal.fr
ADR;TYPE=WORK:;;12 rue de la Mairie;Nantes;;44000;France
URL:https://example.com
END:VCARD`.replace(/\n/g, '\r\n');
    const blob = new Blob([vcf], {type:'text/vcard'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'WebLocal.vcf';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // Cookie banner & préférences
  const cookieBanner = $('#cookieBanner');
  const cookieDialog = $('#cookieDialog');
  const hasConsent = store.get('cookieConsent');
  if (!hasConsent) cookieBanner.style.display = 'flex';

  $('#cookieAccept')?.addEventListener('click', () => {
    store.set('cookieConsent', { analytics: true, when: new Date().toISOString() });
    if (cookieBanner) cookieBanner.style.display = 'none';
    initAnalytics();
  });

  $('#cookieDecline')?.addEventListener('click', () => {
    store.set('cookieConsent', { analytics: false, when: new Date().toISOString() });
    if (cookieBanner) cookieBanner.style.display = 'none';
    disableAnalytics();
  });

  // Ouvrir la modale de préférences depuis la bannière ou le footer
  const openPrefs = () => {
    if (!cookieDialog) return;
    const c = store.get('cookieConsent', { analytics: false });
    const chk = $('#consentAnalytics');
    if (chk) chk.checked = !!c.analytics;
    cookieDialog.showModal();
  };
  $('#cookiePrefs')?.addEventListener('click', openPrefs);
  $('#openCookieDialog')?.addEventListener('click', openPrefs);

  $('#cookieSave')?.addEventListener('click', () => {
    const analyticsOk = $('#consentAnalytics')?.checked ?? false;
    store.set('cookieConsent', { analytics: analyticsOk, when: new Date().toISOString() });
    cookieDialog?.close();
    if (cookieBanner) cookieBanner.style.display = 'none';
    if (analyticsOk) initAnalytics(); else disableAnalytics();
  });

  // Fermer la modale en cliquant sur l'arrière‑plan
  cookieDialog?.addEventListener('click', (e) => {
    if (e.target === cookieDialog) cookieDialog.close();
  });

  // Activer analytics si déjà consenti
  if (hasConsent?.analytics) initAnalytics();

  // Newsletter (fallback mailto + stockage local)
  $('#newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsletterEmail')?.value.trim() || '';
    const msg = $('#newsletterMsg');
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      msg && (msg.textContent = 'Merci de saisir un email valide.');
      return;
    }
    store.set('newsletter', { email, when: new Date().toISOString() });
    msg && (msg.textContent = 'Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.');
    // Fallback mailto
    const subject = encodeURIComponent('Inscription newsletter');
    const body = encodeURIComponent(`Bonjour,\n\nMerci de m’inscrire à la newsletter.\nEmail : ${email}\n`);
    window.location.href = `mailto:bonjour@weblocal.fr?subject=${subject}&body=${body}`;
    Analytics.log('newsletter_subscribed', { email_domain: email.split('@')[1] || '' });
  });

  // Autosauvegarde formulaire de contact
  autosave('contactForm', ['name', 'email', 'phone', 'subject', 'message']);

  // Accessibilité: fermer toutes les <dialog> en appuyant sur Echap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('dialog[open]').forEach(d => d.close());
    }
  });

  // Traçage des CTA (si analytics actif)
  $$('.btn-primary').forEach(b =>
    b.addEventListener('click', () => Analytics.log('cta', { label: (b.textContent || '').trim().slice(0, 60) }))
  );

  // Helpers -------------------------------------------------------------

  // Téléchargement d’un fichier texte
  function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }

  // Autosave simple pour formulaire
  function autosave(formId, fields) {
    const form = document.getElementById(formId);
    if (!form) return;
    const key = `autosave:${formId}`;
    const saved = store.get(key, {});
    fields.forEach(f => {
      if (form.elements[f] && saved[f]) form.elements[f].value = saved[f];
    });
    form.addEventListener('input', () => {
      const data = {};
      fields.forEach(f => data[f] = form.elements[f]?.value || '');
      store.set(key, data);
    });
  }

  // Mini “analytics” local respectant le consentement
  const Analytics = {
    enabled: false,
    init() {
      if (this.enabled) return;
      this.enabled = true;
      this.log('init', { ua: navigator.userAgent, lang: document.documentElement.lang });
      // Exemple d’événements UI
      window.addEventListener('click', (e) => {
        const t = e.target.closest('a, button');
        if (!t) return;
        this.log('ui', {
          role: t.tagName.toLowerCase(),
          id: t.id || null,
          text: (t.textContent || '').trim().slice(0, 40)
        });
      });
    },
    log(event, data = {}) {
      if (!this.enabled) return;
      const entry = { event, t: Date.now(), ...data };
      const stack = store.get('analytics', []);
      stack.push(entry);
      // On limite à 200 entrées pour éviter de saturer localStorage
      store.set('analytics', stack.slice(-200));
    }
  };

  function initAnalytics() {
    Analytics.init();
  }
  function disableAnalytics() {
    Analytics.enabled = false;
  }

}); // fin DOMContentLoaded
