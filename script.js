// Utility: clamp
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle (dark / light, with localStorage)
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') body.classList.add('light');
themeToggle.textContent = body.classList.contains('light') ? '☀' : '☾';
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
  themeToggle.textContent = body.classList.contains('light') ? '☀' : '☾';
});

// 3D tilt on elements with [data-tilt]
(function enableTilt(){
  const tiltEls = Array.from(document.querySelectorAll('[data-tilt]'));
  const strength = 12;        // max deg tilt
  const depthPop = 18;        // translateZ on hover
  tiltEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = clamp((-dy * strength), -strength, strength);
      const ry = clamp((dx * strength), -strength, strength);
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      // Add subtle pop for children with translateZ
      Array.from(el.children).forEach(child => {
        child.style.transform = child.classList.contains('card-depth')
          ? `translateZ(50px) rotateX(${rx/4}deg) rotateY(${ry/4}deg)`
          : '';
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg)';
      Array.from(el.children).forEach(c => c.style.transform = '');
    });
  });
})();

// 3D Wall drag-to-rotate
(function wall3dRotation(){
  const wall = document.getElementById('wall3d');
  if (!wall) return;
  let isDown = false, startX = 0, rotY = -6, rotX = 4;

  const apply = () => {
    wall.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };
  apply();

  const start = (clientX, clientY) => {
    isDown = true;
    startX = clientX;
  };
  const move = (clientX, clientY) => {
    if (!isDown) return;
    const dx = clientX - startX;
    rotY = clamp(rotY + dx * 0.05, -40, 40);
    startX = clientX;
    apply();
  };
  const end = () => isDown = false;

  // Mouse
  wall.addEventListener('mousedown', e => start(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', end);

  // Touch
  wall.addEventListener('touchstart', e => start(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
  wall.addEventListener('touchmove', e => move(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
  wall.addEventListener('touchend', end);
})();

// 3D Coverflow
(function coverflow(){
  const root = document.getElementById('coverflow');
  if (!root) return;
  const track = root.querySelector('.coverflow-track');
  const slides = Array.from(track.querySelectorAll('img'));
  const prev = r
