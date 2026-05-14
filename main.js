/* ===== PARTICLES ===== */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    '#ff14dc', '#ff6a00', '#8000ff',
    '#ff4499', '#ff9500', '#cc00ff',
    '#ff1177', '#ff3300'
  ];

  const particles = Array.from({ length: 65 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.65 + 0.2,
    flicker: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const flicker = Math.sin(t * 1.6 + p.flicker) * 0.3 + 0.7;

      ctx.save();
      ctx.globalAlpha = p.alpha * flicker;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ===== MAINTENANCE GATE ===== */
(function () {
  const gate = document.getElementById('maintenanceGate');

  function lockBody() {
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
  }

  function unlockBody() {
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
  }

  lockBody();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      gate.classList.add('visible');
      gate.style.pointerEvents = 'auto';
    });
  });
})();


/* ===== NOTIFY ME — CALENDAR INTEGRATION ===== */
function handleNotify() {
  const btn = document.getElementById('notifyBtn');
  const successMsg = document.getElementById('successMsg');

  btn.innerHTML = '<span class="cal-icon" aria-hidden="true">📅</span> Saving event...';
  btn.disabled = true;
  btn.style.opacity = '0.82';

  /* Build .ics content — works on iOS, macOS, Android, Windows */
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nexovra Studios//Launch Event//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:nexovra-launch-20250515@nexovrastudios.com',
    'DTSTAMP:' + formatICSDate(new Date()),
    'DTSTART:20250515T090000',
    'DTEND:20250515T093000',
    'SUMMARY:Nexovra Studios — Launch Day! 🚀',
    'DESCRIPTION:The new Nexovra Studios website is live today.\\nVisit nexovrastudios.com to explore the new experience.',
    'LOCATION:nexovrastudios.com',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'nexovra-studios-launch.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  /* Revoke after short delay so mobile has time to handle it */
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  /* Update UI after brief pause */
  setTimeout(() => {
    btn.className = 'mg-btn done';
    btn.innerHTML = '<span class="cal-icon" aria-hidden="true">✅</span> You\'re on the list!';
    btn.style.opacity = '1';
    successMsg.classList.add('show');
  }, 900);
}

/* Helper: format current date as ICS DTSTAMP (UTC) */
function formatICSDate(date) {
  const pad = n => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}
