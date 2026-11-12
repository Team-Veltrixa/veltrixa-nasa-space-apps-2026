// Tailwind configuration runs immediately after the Tailwind CDN loads.
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          stardom: ['"Stardom"', '"JetBrains Mono"', 'serif'],
          mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
          sans: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        },
        colors: {
          cosmos: {
            950: '#100a24',
            900: '#1a1238',
            800: '#271b52',
            accent: '#a855f7',
            lavender: '#c084fc',
          },
        },
      },
    },
  };
}

// Wait until the HTML and bottom-of-page animation libraries have loaded.
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -----------------------------------------------------------------------
  // Space video and animated canvas fallback
  // -----------------------------------------------------------------------
  function initSpaceVideoBackdrop() {
    const video = document.getElementById('space-bg-video');
    const badge = document.getElementById('video-feed-badge');
    const canvas = document.getElementById('space-earth-canvas');

    if (video) {
      const revealVideo = () => {
        video.classList.remove('opacity-0');
        video.classList.add('opacity-75');

        if (badge) {
          badge.innerHTML =
            '<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span><span>ISS EARTH VIDEO // LIVE</span>';
        }
      };

      video.addEventListener('playing', revealVideo, { once: true });
      video.addEventListener('canplay', revealVideo, { once: true });

      video.play().catch(() => {
        // Keep the animated canvas visible if autoplay fails.
      });
    }

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.6,
      speed: 0.004 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
    }));

    const clouds = Array.from({ length: 18 }, (_, i) => ({
      angle: (i / 18) * Math.PI * 2,
      lat: (Math.random() - 0.5) * 0.85,
      len: 0.18 + Math.random() * 0.25,
      thick: 14 + Math.random() * 26,
      speed: 0.04 + Math.random() * 0.025,
    }));

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function drawSpaceFrame(ms) {
      const t = ms * 0.001;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w * 0.4, h);
      bg.addColorStop(0, '#0f0824');
      bg.addColorStop(0.5, '#1d1240');
      bg.addColorStop(1, '#120b2a');

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        const sx = ((star.x - t * star.speed) % 1 + 1) % 1;
        const alpha = 0.35 + 0.55 * Math.sin(t * 1.4 + star.phase);

        ctx.beginPath();
        ctx.arc(sx * w, star.y * h, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233, 213, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      const earthR = Math.max(w, h) * 0.72;
      const cx = w * 0.72;
      const cy = h + earthR * 0.56;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
      ctx.clip();

      const planetGrad = ctx.createRadialGradient(
        cx - earthR * 0.25,
        cy - earthR * 0.75,
        earthR * 0.05,
        cx,
        cy,
        earthR
      );

      planetGrad.addColorStop(0, '#38bdf8');
      planetGrad.addColorStop(0.28, '#1e3a8a');
      planetGrad.addColorStop(0.6, '#312e81');
      planetGrad.addColorStop(1, '#090517');

      ctx.fillStyle = planetGrad;
      ctx.fillRect(cx - earthR, cy - earthR, earthR * 2, earthR * 2);

      for (const cloud of clouds) {
        const angle = cloud.angle + t * cloud.speed * 0.22;
        const px = cx + Math.sin(angle) * earthR * 0.92;
        const py = cy - Math.cos(angle) * earthR * (0.86 + cloud.lat * 0.08);

        ctx.beginPath();
        ctx.ellipse(
          px,
          py,
          earthR * cloud.len,
          cloud.thick,
          angle * 0.25,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(224, 242, 254, 0.09)';
        ctx.fill();
      }

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, earthR, Math.PI * 1.05, Math.PI * 1.95);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.42)';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 42;
      ctx.stroke();
      ctx.shadowBlur = 0;

      requestAnimationFrame(drawSpaceFrame);
    }

    requestAnimationFrame(drawSpaceFrame);
  }

  // -----------------------------------------------------------------------
  // Simulation environments — retained from the original file
  // -----------------------------------------------------------------------
  const ENVIRONMENTS = {
    'earth-air': {
      label: '1G Earth Air',
      badge: 'BASELINE // 1G CONVECTION',
      badgeClass: 'border-cyan-400/45 bg-cyan-950/40 text-cyan-300',
      safety: 84.63,
      o2: 20.94,
      temp: 1674.82,
      pressure: 101.34,
      co: 12.64,
      airflow: 14.28,
      radiant: 41.87,
      gravity: 0.998412,
      waveColor: '#38bdf8',
      waveAmp: 0.44,
      waveFreq: 1.05,
      note: 'Standard terrestrial atmosphere: thermal buoyancy draws cooler O2 inward and stretches soot into a luminous plume.',
    },

    'artemis-moon': {
      label: 'Artemis Moon Base',
      badge: 'CAUTION // ELEVATED O2',
      badgeClass: 'border-purple-400/50 bg-purple-950/50 text-purple-200',
      safety: 37.19,
      o2: 34.18,
      temp: 1912.46,
      pressure: 56.73,
      co: 74.39,
      airflow: 6.84,
      radiant: 68.52,
      gravity: 0.165408,
      waveColor: '#c084fc',
      waveAmp: 0.72,
      waveFreq: 1.58,
      note: 'Reduced-pressure lunar exploration atmosphere (~34% O2) significantly lowers solid-material ignition thresholds (NASA/TM-20210011385).',
    },

    'pure-oxygen': {
      label: '100% Pure Oxygen',
      badge: 'CRITICAL // RAPID SPREAD',
      badgeClass: 'border-rose-400/60 bg-rose-950/50 text-rose-300 animate-pulse',
      safety: 11.43,
      o2: 99.84,
      temp: 2847.31,
      pressure: 34.48,
      co: 148.92,
      airflow: 21.73,
      radiant: 91.36,
      gravity: 0.000004,
      waveColor: '#fb7185',
      waveAmp: 0.95,
      waveFreq: 2.35,
      note: 'Pure oxygen atmosphere produces near-instantaneous material flame spread and extreme thermal flux across cabin surfaces.',
    },
  };

  // -----------------------------------------------------------------------
  // Embedded research records — retained from the original file
  // -----------------------------------------------------------------------
  const NASA_DOCS = [
    {
      id: 'bass-ii-final',
      code: 'NASA/TM-20210011385',
      program: 'BASS-II',
      facility: 'ISS Microgravity Science Glovebox (2021)',
      title: 'Burning and Suppression of Solids II: Low-Velocity Airflow & Extinction Limits',
      summary:
        'Summarizes ISS microgravity solid-fuel flammability tests across acrylic rods, cotton-fiberglass fabric (SIBAL), Nomex, and Ultem at airflow velocities up to 53 cm/s and variable oxygen levels.',
      takeaway:
        'Forced cabin ventilation between 0.5 and 5.0 cm/s intensifies microgravity combustion and lowers the oxygen concentration needed for fire to survive.',
      tags: ['bass', 'airflow', 'fans', 'oxygen', 'suppression', 'artemis'],
    },
    {
      id: 'bass-ii-sensors',
      code: 'NTRS 20150019858',
      program: 'BASS-II',
      facility: 'ISS MSG // CSA-CP & CDM Instruments (2015)',
      title: 'Gas Sensor Readings During Nitrogen-Diluted Microgravity Solid Combustion',
      summary:
        'Tracks real-time oxygen depletion alongside CO and CO2 toxic gas output using onboard NASA CSA-CP and CDM sensors inside nitrogen-diluted glovebox atmospheres.',
      takeaway:
        'Oxygen-lean spacecraft fires release disproportionately elevated carbon monoxide ratios prior to visible soot alarms—requiring continuous chemical telemetry.',
      tags: ['bass', 'co', 'sensors', 'toxicity', 'oxygen', 'nitrogen'],
    },
    {
      id: 'flex-cool',
      code: 'NASA/TP-2015-216046',
      program: 'FLEX',
      facility: 'ISS Combustion Integrated Rack (2015)',
      title: 'Flame Extinguishment Experiment: Persistent Invisible Cool Flames',
      summary:
        'Documents isolated n-heptane and methanol fuel droplet burns in microgravity (Report E-18493), capturing sustained ~500-600 C chemical oxidation after hot visible flames extinguished.',
      takeaway:
        'Cool flames emit almost zero soot or visible light and can unexpectedly reignite into hot flames if ventilation resumes prematurely.',
      tags: ['flex', 'cool', 'invisible', 'reignition', 'droplet'],
    },
    {
      id: 'acme-sflame',
      code: 'ACME // CIR-2017-2022',
      program: 'ACME',
      facility: 'ISS Combustion Integrated Rack (2022)',
      title: 's-Flame & Burning Rate Emulator: Spherical Flames Near Dilution Limits',
      summary:
        'Executed spherical steady-state gaseous diffusion flames (s-Flame) and gaseous solid-fuel emulation (BRE) under Dennis Stocker et al. to benchmark ignition and extinction kinetics without buoyancy.',
      takeaway:
        'Microgravity enables ultra-weak diluted flames that would immediately blow out on Earth, refining flammability margins for future Lunar and Mars habitats.',
      tags: ['acme', 'spherical', 's-flame', 'bre', 'extinction'],
    },
    {
      id: 'acme-efield',
      code: 'ACME // E-FIELD & CLD',
      program: 'ACME',
      facility: 'ISS Combustion Integrated Rack (2021)',
      title: 'Electric-Field Ionic Control & Low-Gravity Smoke Point Behavior',
      summary:
        'Demonstrated ionic-wind flame manipulation and soot reduction via high-voltage electric fields while mapping coflow smoke points that diverge from terrestrial predictions.',
      takeaway:
        'Applied electric fields can actively suppress soot inception and stabilize or extinguish low-gravity flames without moving hardware.',
      tags: ['acme', 'soot', 'electric', 'smoke'],
    },
    {
      id: 'saffire-cygnus',
      code: 'NASA/TM-2012-217712',
      program: 'Saffire',
      facility: 'Uncrewed Cygnus Resupply Spacecraft (2012-2023)',
      title: 'Saffire Large-Scale Cabin Fire Spread & Over-Pressurization Prevention',
      summary:
        'Scaled benchtop microgravity combustion results to realistic spacecraft cabin dimensions aboard departing Cygnus vehicles burning wide cotton-fiberglass sheets and thick acrylic panels.',
      takeaway:
        'Quantified large-scale cabin pressure spikes and bulkhead heating under elevated oxygen and duct airflow conditions.',
      tags: ['saffire', 'cygnus', 'cabin', 'pressure', 'oxygen'],
    },
  ];

  // -----------------------------------------------------------------------
  // Preset assistant responses — retained from the original file
  // -----------------------------------------------------------------------
  const QA_RESPONSES = [
    {
      keywords: ['fan', 'fans', 'airflow', 'accelerate', 'ventilation', 'wind'],
      text:
        'In microgravity, stagnant exhaust chokes a flame until spacecraft ventilation delivers fresh oxygen. BASS-II tests proved low airflow (0.5-5 cm/s) lets materials burn hotter and at lower O2 limits than on Earth. Cutting cabin fans is always the primary suppression step.',
      receipts: ['bass-ii-final', 'saffire-cygnus'],
    },
    {
      keywords: ['cool', 'invisible', 'reignition', 'reignite', 'delayed', 'flex'],
      text:
        'NASA FLEX droplet experiments discovered that after visible flames go out, lingering vapor sustains a ~500-600 C "cool flame" with virtually zero soot or visible glow. It produces CO/formaldehyde and can flash back into a hot flame if disturbed.',
      receipts: ['flex-cool', 'bass-ii-sensors'],
    },
    {
      keywords: ['34', '100', 'oxygen', 'pure', 'habitat', 'artemis', 'hazardous'],
      text:
        'Both 34% O2 exploration habitats (Artemis-class reduced pressure) and 100% pure oxygen environments radically lower ignition resistance and speed up flame propagation, driving thermal flux and CO output to dangerous levels.',
      receipts: ['bass-ii-final', 'saffire-cygnus', 'acme-sflame'],
    },
  ];

  const state = {
    activeEnv: 'artemis-moon',
    activeFilter: 'ALL',
    searchQuery: '',
    consoleBooted: false,
    waveColor: '#c084fc',
    waveAmp: 0.72,
    waveFreq: 1.58,
    currentVals: {
      safety: 0,
      o2: 0,
      temp: 0,
      pressure: 0,
      co: 0,
      airflow: 0,
      radiant: 0,
      gravity: 0,
    },
  };

  const DIAL_ARC_LEN = 163.4;

  function escapeHtml(text) {
    return String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // -----------------------------------------------------------------------
  // Scroll-triggered flame morph
  // -----------------------------------------------------------------------
  function initScrollFlameMorph() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const gravityEl = document.getElementById('morph-g-value');
    const shapeEl = document.getElementById('morph-shape-label');
    const tagEl = document.getElementById('morph-stage-tag');
    const badgeEl = document.getElementById('morph-placeholder-badge');
    const scrubBar = document.getElementById('morph-scrub-bar');

    gsap.set('#earth-flame-img', { opacity: 1, scale: 1 });
    gsap.set('#microgravity-flame-img', { opacity: 0, scale: 0.94 });
    gsap.set('#morph-scale-box', { scale: 1 });

    const morphTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#morph-section',
        start: 'top 15%',
        end: 'bottom 80%',
        scrub: 0.65,

        onUpdate: (self) => {
          const progress = self.progress;
          const gravity = Math.max(
            0.000003,
            0.998412 * Math.pow(1 - progress, 3.2)
          );

          if (gravityEl) {
            gravityEl.textContent = `${gravity.toFixed(6)} G`;
          }

          if (scrubBar) {
            scrubBar.style.width = `${(progress * 100).toFixed(2)}%`;
          }

          const isMicro = progress > 0.62;

          if (shapeEl) {
            shapeEl.textContent = isMicro
              ? 'MICROGRAVITY SPHERE'
              : 'EARTH FLAME';
          }

          if (tagEl) {
            tagEl.textContent = isMicro
              ? '[SCROLL_STAGE_02] // MICROGRAVITY SPHERE LOCKED'
              : '[SCROLL_STAGE_01] // EARTH FLAME BUOYANCY BASELINE';

            tagEl.classList.toggle('text-cyan-300', isMicro);
            tagEl.classList.toggle('text-purple-300', !isMicro);
          }

          if (badgeEl) {
            badgeEl.textContent = isMicro
              ? 'PLACEHOLDER: MICROGRAVITY SPHERE'
              : 'PLACEHOLDER: EARTH FLAME';

            badgeEl.classList.toggle('text-cyan-300', isMicro);
            badgeEl.classList.toggle('text-amber-300', !isMicro);
          }
        },
      },
    });

    morphTl
      .to(
        '#earth-flame-img',
        { opacity: 0, scale: 0.92, ease: 'none', duration: 1 },
        0
      )
      .to(
        '#microgravity-flame-img',
        { opacity: 1, scale: 1, ease: 'none', duration: 1 },
        0
      )
      .to(
        '#morph-scale-box',
        { scale: 1.16, ease: 'power1.out', duration: 1 },
        0
      )
      .to(
        '#morph-reticle-ring',
        {
          scale: 1.08,
          rotation: 28,
          opacity: 0.85,
          ease: 'none',
          duration: 1,
        },
        0
      )
      .to(
        '#morph-caption-earth',
        { opacity: 0, y: -16, duration: 0.35 },
        0.12
      )
      .to(
        '#morph-caption-micro',
        { opacity: 1, y: 0, duration: 0.4 },
        0.55
      );
  }

  // -----------------------------------------------------------------------
  // Telemetry and environment switcher
  // -----------------------------------------------------------------------
  function tweenMetric(id, from, to, decimals, duration = 1.2) {
    const el = document.getElementById(id);
    if (!el) return;

    if (typeof gsap === 'undefined') {
      el.textContent = to.toFixed(decimals);
      return;
    }

    const proxy = { value: from };

    gsap.to(proxy, {
      value: to,
      duration,
      ease: 'power2.out',

      onUpdate: () => {
        el.textContent = proxy.value.toFixed(decimals);
      },

      onComplete: () => {
        el.textContent = to.toFixed(decimals);
      },
    });
  }

  function applyEnvironment(envKey, fromZero = false) {
    const env = ENVIRONMENTS[envKey];
    if (!env) return;

    state.activeEnv = envKey;
    state.waveColor = env.waveColor;
    state.waveAmp = env.waveAmp;
    state.waveFreq = env.waveFreq;

    document.querySelectorAll('.env-toggle-btn').forEach((btn) => {
      const active = btn.dataset.env === envKey;

      btn.className = active
        ? 'env-toggle-btn px-6 py-4 rounded-xl border border-purple-400 bg-purple-500/25 text-xs sm:text-sm font-bold text-white shadow-[0_0_24px_rgba(168,85,247,0.3)] transition cursor-pointer'
        : 'env-toggle-btn px-6 py-4 rounded-xl border border-purple-400/25 bg-cosmos-950/60 hover:border-purple-300 text-xs sm:text-sm font-bold text-violet-200 transition cursor-pointer';
    });

    const badge = document.getElementById('alarm-badge');

    if (badge) {
      badge.className =
        `px-3 py-1.5 rounded border text-[11px] font-bold ${env.badgeClass}`;
      badge.textContent = env.badge;
    }

    const noteEl = document.getElementById('env-telemetry-note');
    if (noteEl) noteEl.textContent = env.note;

    const gravityEl = document.getElementById('val-gravity');
    if (gravityEl) gravityEl.textContent = `${env.gravity.toFixed(6)} G`;

    const mappings = [
      ['safety', 'val-safety', 2],
      ['o2', 'val-o2', 2],
      ['temp', 'val-temp', 2],
      ['pressure', 'val-pressure', 2],
      ['co', 'val-co', 2],
      ['airflow', 'val-airflow', 2],
      ['radiant', 'val-radiant', 2],
    ];

    mappings.forEach(([key, domId, decimals]) => {
      const start = fromZero ? 0 : state.currentVals[key];

      tweenMetric(
        domId,
        start,
        env[key],
        decimals,
        fromZero ? 1.5 : 0.9
      );

      state.currentVals[key] = env[key];
    });

    const needleAngle = -72 + (env.safety / 100) * 144;
    const arcOffset = DIAL_ARC_LEN * (1 - env.safety / 100);

    if (typeof gsap !== 'undefined') {
      gsap.to('#safety-dial-needle', {
        attr: {
          transform: `rotate(${needleAngle.toFixed(2)} 70 70)`,
        },
        duration: 1.05,
        ease: 'power3.out',
      });

      gsap.to('#safety-dial-arc', {
        strokeDashoffset: arcOffset,
        duration: 1.05,
        ease: 'power3.out',
      });
    }
  }

  function startDirtyTelemetryDrift() {
    setInterval(() => {
      if (!state.consoleBooted) return;

      const env = ENVIRONMENTS[state.activeEnv];
      if (!env) return;

      const jitter = (base, span, decimals = 2) => {
        const delta = (Math.random() - 0.5) * span;
        return Math.max(0.01, base + delta).toFixed(decimals);
      };

      const oxygenEl = document.getElementById('val-o2');
      const tempEl = document.getElementById('val-temp');
      const coEl = document.getElementById('val-co');

      if (oxygenEl) oxygenEl.textContent = jitter(env.o2, 0.06, 2);
      if (tempEl) tempEl.textContent = jitter(env.temp, 3.4, 2);
      if (coEl) coEl.textContent = jitter(env.co, 0.48, 2);
    }, 1600);
  }

  // -----------------------------------------------------------------------
  // Thermal flux waveform
  // -----------------------------------------------------------------------
  function initWaveform() {
    const canvas = document.getElementById('telemetry-wave');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    function draw() {
      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.beginPath();

      const mid = height * 0.52;
      const amplitude = height * 0.36 * state.waveAmp;

      for (let x = 0; x <= width; x += 2) {
        const u = x / width;

        const y =
          mid +
          (
            Math.sin(u * 13 * state.waveFreq + time) * 0.6 +
            Math.sin(u * 29 * state.waveFreq - time * 1.4) * 0.25 +
            Math.cos(u * 47 + time * 2.1) * 0.15
          ) * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = state.waveColor;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      time += 0.06 * state.waveFreq;
      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  // -----------------------------------------------------------------------
  // Panel entrance animation
  // -----------------------------------------------------------------------
  function runPanelBoot() {
    if (state.consoleBooted) return;
    state.consoleBooted = true;

    if (typeof gsap === 'undefined') {
      applyEnvironment(state.activeEnv, true);
      return;
    }

    const timeline = gsap.timeline();

    timeline
      .to(
        '#panel-telemetry',
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0
      )
      .to(
        '#panel-research',
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0.1
      )
      .to(
        '#panel-assistant',
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0.2
      )
      .fromTo(
        '#dashboard-panels .panel-scan-line',
        { top: '-6%', opacity: 0.9 },
        {
          top: '106%',
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.inOut',
        },
        0.3
      )
      .add(() => applyEnvironment(state.activeEnv, true), 0.3);
  }

  function initPanelBoot() {
    document.querySelectorAll('.env-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!state.consoleBooted) {
          state.activeEnv = btn.dataset.env;
          runPanelBoot();
        } else {
          applyEnvironment(btn.dataset.env, false);
        }
      });
    });

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      runPanelBoot();
      return;
    }

    gsap.set('#panel-telemetry', { x: -60, opacity: 0 });
    gsap.set('#panel-research', { y: 48, opacity: 0 });
    gsap.set('#panel-assistant', { x: 60, opacity: 0 });

    ScrollTrigger.create({
      trigger: '#dashboard-panels',
      start: 'top 78%',
      once: true,
      onEnter: runPanelBoot,
    });
  }

  // -----------------------------------------------------------------------
  // Research explorer and document modal
  // -----------------------------------------------------------------------
  function openDocModal(docId) {
    const doc = NASA_DOCS.find((item) => item.id === docId);
    const modal = document.getElementById('doc-modal');

    if (!doc || !modal) return;

    document.getElementById('modal-code').textContent =
      `${doc.code} // ${doc.program}`;

    document.getElementById('modal-title').textContent = doc.title;
    document.getElementById('modal-meta').textContent = doc.facility;
    document.getElementById('modal-summary').textContent = doc.summary;
    document.getElementById('modal-takeaway').textContent = doc.takeaway;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closeDocModal() {
    const modal = document.getElementById('doc-modal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function renderDocs() {
    const listEl = document.getElementById('research-doc-list');
    const countEl = document.getElementById('doc-match-count');

    if (!listEl) return;

    const query = state.searchQuery.trim().toLowerCase();

    const matches = NASA_DOCS.filter((doc) => {
      if (state.activeFilter !== 'ALL' && doc.program !== state.activeFilter) {
        return false;
      }

      if (!query) return true;

      return [
        doc.code,
        doc.program,
        doc.title,
        doc.summary,
        doc.takeaway,
        ...doc.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

    if (countEl) {
      countEl.textContent = `${matches.length} RECORDS`;
    }

    if (matches.length === 0) {
      listEl.innerHTML = `
        <div class="p-6 rounded-xl border border-purple-400/20 bg-cosmos-950/60 text-xs text-purple-200/75 leading-loose">
          No NASA records matched "${escapeHtml(state.searchQuery)}".
          Try BASS, ACME, FLEX, or Saffire.
        </div>
      `;
      return;
    }

    listEl.innerHTML = matches
      .map((doc) => `
        <button
          type="button"
          data-doc="${escapeHtml(doc.id)}"
          class="doc-card w-full text-left p-6 rounded-xl border border-purple-400/20 hover:border-purple-300/70 bg-cosmos-950/60 space-y-3 transition cursor-pointer"
        >
          <div class="flex items-center justify-between gap-4 text-[11px]">
            <span class="text-cyan-300 font-bold">
              ${escapeHtml(doc.code)}
            </span>
            <span class="px-2 py-0.5 rounded border border-purple-400/30 text-purple-200">
              ${escapeHtml(doc.program)}
            </span>
          </div>

          <h4 class="font-stardom text-sm text-white leading-relaxed">
            ${escapeHtml(doc.title)}
          </h4>

          <p class="text-xs text-violet-200/75 leading-loose">
            ${escapeHtml(doc.takeaway)}
          </p>
        </button>
      `)
      .join('');

    listEl.querySelectorAll('.doc-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        openDocModal(btn.dataset.doc);
      });
    });
  }

  function initResearchExplorer() {
    document.getElementById('nasa-search-input')?.addEventListener('input', (event) => {
      state.searchQuery = event.target.value;
      renderDocs();
    });

    document.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeFilter = btn.dataset.filter || 'ALL';

        document.querySelectorAll('.filter-chip').forEach((chip) => {
          const active = chip === btn;

          chip.className = active
            ? 'filter-chip px-3.5 py-2 rounded-lg border border-purple-400 bg-purple-500/25 text-[11px] text-white cursor-pointer'
            : 'filter-chip px-3.5 py-2 rounded-lg border border-purple-400/25 bg-cosmos-950/60 text-[11px] text-violet-200 cursor-pointer';
        });

        renderDocs();
      });
    });

    document.getElementById('modal-close')?.addEventListener('click', closeDocModal);

    document.getElementById('doc-modal')?.addEventListener('click', (event) => {
      if (event.target.id === 'doc-modal') closeDocModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDocModal();
    });

    renderDocs();
  }

  // -----------------------------------------------------------------------
  // Preset chat assistant
  // -----------------------------------------------------------------------
  function findVerifiedAnswer(query) {
    const normalizedQuery = query.toLowerCase();

    let best = null;
    let bestScore = 0;

    for (const item of QA_RESPONSES) {
      let score = 0;

      for (const keyword of item.keywords) {
        if (normalizedQuery.includes(keyword)) score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    if (!best || bestScore === 0) {
      return {
        text:
          'RECEIPTS LOCKED: Query outside hardcoded NASA NTRS safety corpus. Please ask about cabin fans (BASS-II), invisible cool flames (FLEX), or 34% / 100% oxygen habitat hazards.',
        receipts: ['bass-ii-final', 'flex-cool'],
      };
    }

    return best;
  }

  function addChatMessage(role, text, receipts = []) {
    const log = document.getElementById('chat-log');
    if (!log) return;

    const el = document.createElement('div');

    if (role === 'user') {
      el.className =
        'p-5 rounded-xl border border-purple-400/40 bg-purple-950/35 text-xs text-white leading-loose';

      el.textContent = `> ${text}`;
    } else {
      const pills = receipts
        .map((id) => {
          const doc = NASA_DOCS.find((item) => item.id === id);
          if (!doc) return '';

          return `
            <button
              type="button"
              data-receipt="${escapeHtml(doc.id)}"
              class="px-3 py-1 rounded border border-emerald-400/45 bg-emerald-950/35 hover:bg-emerald-900/50 text-[10px] text-emerald-300 transition cursor-pointer"
            >
              RECEIPT: ${escapeHtml(doc.code)}
            </button>
          `;
        })
        .join('');

      el.className =
        'p-6 rounded-xl border border-purple-400/20 bg-cosmos-950/65 text-xs text-violet-100 leading-loose space-y-4';

      el.innerHTML = `
        <p>${escapeHtml(text)}</p>
        ${pills ? `<div class="flex flex-wrap gap-3">${pills}</div>` : ''}
      `;
    }

    log.appendChild(el);

    el.querySelectorAll('[data-receipt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openDocModal(btn.dataset.receipt);
      });
    });

    log.scrollTop = log.scrollHeight;
  }

  function initAssistant() {
    addChatMessage(
      'bot',
      'Terminal assistant initialized under Receipts Locked policy. Every response cites embedded NASA documentation.',
      ['bass-ii-final', 'flex-cool']
    );

    document.querySelectorAll('.suggested-q-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const question = btn.dataset.question || '';

        addChatMessage('user', question);

        const response = findVerifiedAnswer(question);
        addChatMessage('bot', response.text, response.receipts);
      });
    });

    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!input) return;

      const question = input.value.trim();
      if (!question) return;

      addChatMessage('user', question);

      const response = findVerifiedAnswer(question);
      addChatMessage('bot', response.text, response.receipts);

      input.value = '';
    });
  }

  // -----------------------------------------------------------------------
  // Draw fallback flame images when assets are missing
  // -----------------------------------------------------------------------
  function attachFlameFallback() {
    const makeFallback = (kind) => {
      const canvas = document.createElement('canvas');

      canvas.width = 960;
      canvas.height = 640;

      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (kind === 'earth') {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 190);
        ctx.bezierCurveTo(cx + 80, cy - 50, cx + 95, cy + 90, cx, cy + 160);
        ctx.bezierCurveTo(cx - 95, cy + 90, cx - 80, cy - 50, cx, cy - 190);

        const gradient = ctx.createLinearGradient(0, cy - 190, 0, cy + 160);
        gradient.addColorStop(0, '#fef08a');
        gradient.addColorStop(0.55, '#f59e0b');
        gradient.addColorStop(1, '#1d4ed8');

        ctx.fillStyle = gradient;
        ctx.fill();
      } else {
        const gradient = ctx.createRadialGradient(cx, cy, 20, cx, cy, 190);
        gradient.addColorStop(0, '#bae6fd');
        gradient.addColorStop(0.45, '#0ea5e9');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 190, 0, Math.PI * 2);
        ctx.fill();
      }

      return canvas.toDataURL('image/png');
    };

    [
      ['earth-flame-img', 'earth'],
      ['microgravity-flame-img', 'micro'],
    ].forEach(([id, kind]) => {
      const img = document.getElementById(id);
      if (!img) return;

      const useFallback = () => {
        img.src = makeFallback(kind);
      };

      // Handle images that already failed before DOMContentLoaded.
      if (img.complete && img.naturalWidth === 0) {
        useFallback();
      } else {
        img.addEventListener('error', useFallback, { once: true });
      }
    });
  }

  // -----------------------------------------------------------------------
  // Initialize
  // -----------------------------------------------------------------------
  initSpaceVideoBackdrop();
  attachFlameFallback();
  initScrollFlameMorph();
  initWaveform();
  initResearchExplorer();
  initAssistant();
  initPanelBoot();
  startDirtyTelemetryDrift();
});