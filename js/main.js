/* Consultoria de IA Tastefy · apresentação Shark Tastefy
   Navegação: → / espaço / clique avança · ← volta · Home início · End fecho · F tela cheia · T cronômetro · R zera cronômetro */
(() => {
  gsap.registerPlugin(SplitText, CustomEase);
  CustomEase.create('soft', 'M0,0 C0.16,1 0.3,1 1,1');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const GOLD = '#ffcc00';

  const ORDER = ['s0','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','aA','aB','aC','aD','aE','aF','aG'];
  const MAIN_LAST = ORDER.indexOf('s12');
  const extras = []; // tweens infinitos da cena atual

  /* ---------- textos divididos uma vez ---------- */
  let split = {};
  function prepareSplits() {
    split.q1 = new SplitText('#q1', { type: 'chars' });
    split.q3 = new SplitText('#q3', { type: 'words' });
    split.q5 = new SplitText('#q5', { type: 'words' });
    split.brand = new SplitText('#s5b .brand', { type: 'chars' });
    split.end = new SplitText('#end', { type: 'chars' });
  }

  /* ---------- 517 pontos ---------- */
  const D = { cv: null, ctx: null, W: 0, H: 0, dpr: 1, pts: [], r: 3, p: 0, fade: 1, solid: 0, scale: 1, text: null, on: false };
  function rand(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function layoutDots() {
    D.cv = $('#dots'); D.ctx = D.cv.getContext('2d');
    D.dpr = Math.min(2, window.devicePixelRatio || 1);
    D.W = innerWidth; D.H = innerHeight;
    D.cv.width = Math.round(D.W * D.dpr); D.cv.height = Math.round(D.H * D.dpr);
    const el = $('#n517');
    const r = el.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(el).fontSize);
    const font = `900 ${fs}px "Montserrat Alternates"`;
    const ls = -0.05 * fs;
    const oc = document.createElement('canvas');
    oc.width = Math.ceil(D.W); oc.height = Math.ceil(D.H);
    const o = oc.getContext('2d');
    o.font = font; o.letterSpacing = ls + 'px'; o.textAlign = 'center'; o.textBaseline = 'alphabetic';
    const m = o.measureText('517');
    const asc = m.actualBoundingBoxAscent, des = m.actualBoundingBoxDescent;
    const cx = r.left + r.width / 2;
    const by = r.top + r.height / 2 + (asc - des) / 2;
    o.fillStyle = '#fff'; o.fillText('517', cx, by);
    D.text = { cx, by, font, ls };
    const data = o.getImageData(0, 0, oc.width, oc.height).data;
    const x0 = Math.max(0, Math.floor(cx - m.actualBoundingBoxLeft - 2)), x1 = Math.min(oc.width - 1, Math.ceil(cx + m.actualBoundingBoxRight + 2));
    const y0 = Math.max(0, Math.floor(by - asc - 2)), y1 = Math.min(oc.height - 1, Math.ceil(by + des + 2));
    const filled = (x, y) => data[((y | 0) * oc.width + (x | 0)) * 4 + 3] > 128;
    const sample = s => { const out = []; for (let y = y0 + s / 2; y < y1; y += s) for (let x = x0 + s / 2; x < x1; x += s) if (filled(x, y)) out.push([x, y]); return out; };
    let lo = 2, hi = 120;
    for (let k = 0; k < 22; k++) { const mid = (lo + hi) / 2; if (sample(mid).length >= 517) lo = mid; else hi = mid; }
    const all = sample(lo);
    const pick = [];
    for (let k = 0; k < 517; k++) pick.push(all[Math.floor(k * all.length / 517)]);
    D.r = Math.max(1.6, lo * 0.34);
    D.pts = pick.map((t, i) => ({ tx: t[0], ty: t[1], sx: rand(i) * D.W, sy: rand(i + 999) * D.H, d: rand(i + 77) * 0.35 }));
  }
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function drawDots() {
    const c = D.ctx; if (!c) return;
    c.setTransform(D.dpr, 0, 0, D.dpr, 0, 0);
    c.clearRect(0, 0, D.W, D.H);
    if (D.fade > 0.001) {
      c.globalAlpha = D.fade; c.fillStyle = GOLD; c.beginPath();
      for (const q of D.pts) {
        let t = (D.p - q.d) / 0.65; t = t < 0 ? 0 : t > 1 ? 1 : easeIO(t);
        const x = q.sx + (q.tx - q.sx) * t, y = q.sy + (q.ty - q.sy) * t;
        const rr = D.r * (0.55 + 0.45 * t);
        c.moveTo(x + rr, y); c.arc(x, y, rr, 0, Math.PI * 2);
      }
      c.fill();
    }
    if (D.solid > 0.001 && D.text) {
      c.globalAlpha = D.solid;
      c.translate(D.text.cx, D.text.by); c.scale(D.scale, D.scale); c.translate(-D.text.cx, -D.text.by);
      c.font = D.text.font; c.letterSpacing = D.text.ls + 'px'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      c.fillStyle = GOLD; c.fillText('517', D.text.cx, D.text.by);
    }
    c.globalAlpha = 1;
  }
  gsap.ticker.add(() => { try { if (D.on) drawDots(); } catch (e) { console.error(e); D.on = false; } });

  /* ---------- cenas ---------- */
  const up = (t, sel, at, o = {}) => t.fromTo(sel, { autoAlpha: 0, y: o.y ?? 26 }, { autoAlpha: 1, y: 0, duration: o.d ?? .7, ease: 'soft', stagger: o.s ?? 0 }, at);
  const fade = (t, sel, at, d = .6) => t.fromTo(sel, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: 'power1.out' }, at);

  const S = {
    s0: { enter: t => fade(t, '#s0 img', 0, 1.2) },
    s1: { enter: t => {
      t.set('#q1 .caret', { autoAlpha: 1 });
      t.fromTo(split.q1.chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, stagger: .05, ease: 'none' }, .3);
      fade(t, '#m1', '+=.5', .8);
      t.call(() => extras.push(gsap.to('#q1 .caret', { autoAlpha: 0, repeat: -1, yoyo: true, duration: .5, ease: 'steps(1)' })));
    } },
    s2: { enter: t => {
      layoutDots(); D.on = true;
      t.set('#n517', { autoAlpha: 0 });
      t.fromTo(D, { p: 0, fade: 1, solid: 0, scale: 1.08 }, { p: 1, duration: 2.4, ease: 'power1.inOut' }, 0);
      t.to(D, { solid: 1, duration: .35, ease: 'power2.out' }, '-=.05');
      t.to(D, { fade: 0, duration: .45 }, '<');
      t.to(D, { scale: 1, duration: .7, ease: 'back.out(3)' }, '<');
      up(t, '#sub517', '-=.3');
      fade(t, '#meta517', '-=.3');
    }, leave: () => { D.on = false; } },
    s3: { enter: t => {
      t.set('#q3 .hl', { '--u': 0 });
      up(t, split.q3.words, .1, { s: .07, y: 34 });
      t.to('#q3 .hl', { '--u': 1, duration: .6, ease: 'power2.inOut' }, '+=.2');
      fade(t, '#m3', '-=.1', .8);
    } },
    s4: { enter: t => {
      const f = $$('#s4 .from'), a = $$('#s4 .arrow'), to = $$('#s4 .to');
      for (let i = 0; i < 4; i++) {
        const at = .2 + i * 1.7;
        t.fromTo(f[i], { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: .55, ease: 'soft' }, at);
        t.fromTo(a[i], { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: .5, ease: 'power2.inOut' }, at + .3);
        t.fromTo(to[i], { autoAlpha: 0, scale: .82 }, { autoAlpha: 1, scale: 1, duration: .6, ease: 'back.out(2.2)', transformOrigin: '0% 50%' }, at + .65);
      }
      t.call(() => extras.push(gsap.to('#s4 .q', { opacity: .3, repeat: -1, yoyo: true, duration: .75, ease: 'sine.inOut' })));
    } },
    s5: {
      enter: t => {
        t.set('#s5b', { autoAlpha: 0 }); t.set('#s5a', { autoAlpha: 1 });
        up(t, split.q5.words, .1, { s: .06, y: 30 });
        fade(t, '#s5a .meta', '+=.2', .8);
      },
      steps: [t => {
        t.to(split.q5.words, { autoAlpha: 0, y: -26, duration: .4, stagger: .02, ease: 'power2.in' }, 0);
        t.to('#s5a .meta', { autoAlpha: 0, duration: .3 }, 0);
        t.set('#s5b', { autoAlpha: 1 }, .45);
        t.fromTo(split.brand.chars, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: .7, stagger: .025, ease: 'soft' }, .5);
        up(t, '#s5b .sub', '-=.2');
      }]
    },
    s6: { enter: t => {
      t.fromTo('#s6 .rail i', { scaleX: 0 }, { scaleX: 1, duration: 2.4, ease: 'none' }, .2);
      $$('#s6 .st').forEach((el, i) => up(t, el, .2 + i * .8, { y: 30, d: .7 }));
    } },
    s7: { enter: t => {
      up(t, '#s7 .p', .15, { s: .3, y: 34 });
      fade(t, '#s7 .ref', '+=.1', .7);
      fade(t, '#m7', '-=.2', .7);
    } },
    s8: { enter: t => {
      const o = { a: 0, b: 0 };
      const A = $('#v505'), B = $('#v160');
      t.call(() => { A.textContent = 'R$ 0 mil'; B.textContent = 'R$ 0 mil'; }, null, 0);
      up(t, '#s8 .m', .1, { s: .2, y: 30 });
      t.to(o, { a: 505, b: 160, duration: 1.7, ease: 'power2.out', onUpdate: () => { A.textContent = `R$ ${Math.round(o.a)} mil`; B.textContent = `R$ ${Math.round(o.b)} mil`; } }, .3);
      fade(t, '#m8', '-=.4', .8);
    } },
    s9: { enter: t => up(t, '#s9 .f', .15, { s: .35, y: 36 }) },
    s10: { enter: t => {
      $$('#s10 .r').forEach((el, i) => {
        const at = .15 + i * .55;
        t.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, at);
        t.fromTo($('.a', el), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .5, ease: 'soft' }, at);
        t.fromTo($('.to', el), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .4, ease: 'soft' }, at + .2);
        t.fromTo($('.b', el), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .55, ease: 'soft' }, at + .3);
      });
    } },
    s11: { enter: t => {
      up(t, '#s11 .chan span', .1, { s: .35, y: 30 });
      t.fromTo('#s11 .rail i', { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'none' }, '+=.1');
      $$('#s11 .w').forEach((el, i) => up(t, el, `<${i === 0 ? 0 : .45}`, { y: 20, d: .6 }));
    } },
    s12: { enter: t => {
      t.fromTo(split.end.chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, stagger: .07, ease: 'none' }, .5);
      fade(t, '#s12 img', '+=.8', 1.2);
    } },
  };
  ['aA','aB','aC','aD','aE','aF','aG'].forEach(id => {
    S[id] = { enter: t => { up(t, `#${id} .head`, 0, { y: 16, d: .5 }); up(t, `#${id} .body`, .1, { y: 16, d: .5 }); } };
  });

  /* ---------- paradas ---------- */
  const STOPS = [];
  ORDER.forEach((id, si) => { STOPS.push({ si, step: 0 }); (S[id].steps || []).forEach((_, k) => STOPS.push({ si, step: k + 1 })); });

  let curStop = -1, curSi = -1, tl = null;
  const el = id => document.getElementById(id);

  function killExtras() { while (extras.length) extras.pop().kill(); }
  function hideScene(si, animate) {
    if (si < 0) return;
    const id = ORDER[si];
    if (S[id].leave) S[id].leave();
    gsap.killTweensOf(el(id));
    if (animate) gsap.to(el(id), { autoAlpha: 0, duration: .35, ease: 'power1.in' });
    else gsap.set(el(id), { autoAlpha: 0 });
  }
  function hud(si) {
    const id = ORDER[si];
    const c = $('#count'), p = $('#prog');
    if (si === 0) { c.textContent = ''; p.style.width = '0%'; return; }
    if (si <= MAIN_LAST) { c.textContent = String(si).padStart(2, '0') + ' / 12'; p.style.width = (si / 12 * 100) + '%'; }
    else { c.textContent = 'ANEXO ' + id.slice(1); p.style.width = '100%'; }
  }
  function playScene(si, step, animate) {
    const id = ORDER[si];
    if (tl) tl.kill();
    killExtras();
    gsap.set(el(id), { autoAlpha: 1 });
    tl = gsap.timeline();
    S[id].enter(tl);
    for (let k = 1; k <= step; k++) { tl.progress(1); const t2 = gsap.timeline(); S[id].steps[k - 1](t2); tl = t2; }
    if (!animate) tl.progress(1);
    hud(si);
  }
  function show(i, animate = true) {
    i = Math.max(0, Math.min(STOPS.length - 1, i));
    const target = STOPS[i];
    if (target.si === curSi && i === curStop + 1 && target.step > 0) {
      if (tl) tl.progress(1);
      killExtras();
      tl = gsap.timeline();
      S[ORDER[curSi]].steps[target.step - 1](tl);
      if (!animate) tl.progress(1);
      curStop = i; return;
    }
    const hardCut = ORDER[target.si] === 's12' && animate;
    const prev = curSi;
    if (tl) tl.progress(1);
    hideScene(prev, animate && !hardCut);
    curSi = target.si; curStop = i;
    if (animate && !hardCut && prev >= 0) gsap.delayedCall(.25, () => { if (curStop === i) playScene(target.si, target.step, true); });
    else playScene(target.si, target.step, animate);
  }
  const next = (dir = 1) => show(curStop + dir, true);

  /* ---------- cronômetro ---------- */
  const T = { on: false, start: 0, el: $('#timer'), id: 0 };
  function tick() {
    const left = 120 - (performance.now() - T.start) / 1000;
    const a = Math.abs(left), m = Math.floor(a / 60), s = Math.floor(a % 60);
    T.el.textContent = (left < 0 ? '+' : '') + m + ':' + String(s).padStart(2, '0');
    T.el.classList.toggle('warn', left <= 30 && left > 0);
    T.el.classList.toggle('over', left <= 0);
  }
  function toggleTimer() {
    T.on = !T.on; T.el.classList.toggle('on', T.on);
    if (T.on) { T.start = performance.now(); tick(); T.id = setInterval(tick, 250); } else clearInterval(T.id);
  }

  /* ---------- entrada ---------- */
  addEventListener('keydown', e => {
    if (!window.__site.ready) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); next(-1); }
    else if (k === 'Home') show(0, true);
    else if (k === 'End') show(STOPS.findIndex(s => ORDER[s.si] === 's12'), true);
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
    else if (k === 't' || k === 'T') toggleTimer();
    else if ((k === 'r' || k === 'R') && T.on) T.start = performance.now();
  });
  addEventListener('click', e => { if (window.__site.ready && e.button === 0) next(1); });
  addEventListener('contextmenu', e => { e.preventDefault(); if (window.__site.ready) next(-1); });
  addEventListener('resize', () => { if (ORDER[curSi] === 's2') { layoutDots(); if (!D.on) D.on = true; drawDots(); } });

  window.__site = { stops: STOPS.length, ready: false, go: i => { gsap.set('#loader', { autoAlpha: 0 }); show(i, false); }, next: dir => next(dir || 1) };

  /* ---------- preloader ---------- */
  const bar = $('#loader .bar i');
  const loads = [
    '900 100px "Montserrat Alternates"', '800 100px "Montserrat Alternates"', '700 100px "Montserrat Alternates"', '500 100px "Montserrat Alternates"',
    'italic 400 100px "Instrument Serif"', '500 20px "JetBrains Mono"'
  ].map(f => document.fonts.load(f, 'Não sei mais o que é impossível 517 R$ ção'));
  let done = 0; const total = loads.length + 1;
  const bump = () => { done++; bar.style.width = (done / total * 100) + '%'; };
  loads.forEach(p => p.then(bump, bump));
  const logo = new Image(); logo.src = 'assets/img/logo-branco.webp';
  const pLogo = logo.decode().then(bump, bump);
  const timeout = new Promise(res => setTimeout(res, 3500));
  Promise.race([Promise.all([...loads, pLogo, document.fonts.ready]), timeout]).finally(() => {
    prepareSplits();
    // aquece: monta cada cena uma vez, sem mostrar
    ORDER.forEach(id => { const t = gsap.timeline({ paused: true }); try { S[id].enter(t); (S[id].steps || []).forEach(f => f(t)); t.progress(1).kill(); } catch (e) { console.error(id, e); } gsap.set(el(id), { autoAlpha: 0 }); });
    D.on = false; killExtras();
    window.__site.ready = true;
    gsap.to('#loader', { autoAlpha: 0, duration: .5, delay: .15 });
    show(0, true);
  });
})();
