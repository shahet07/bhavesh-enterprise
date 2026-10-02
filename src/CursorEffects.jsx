import { useEffect, useRef } from 'react';
export default function CursorEffects() {
  const ref = useRef(null);
  useEffect(() => {
    const query = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const cursor = ref.current;
    let card = null, frame = 0, point;
    const reset = () => {
      if (!card) return;
      ['--tilt-x', '--tilt-y', '--spot-x', '--spot-y'].forEach(key => card.style.removeProperty(key));
      card.classList.remove('pointer-active'); card = null;
    };
    const hide = () => { cancelAnimationFrame(frame); frame = 0; cursor.classList.remove('is-visible'); reset(); };
    const move = (e) => {
      if (!query.matches || e.pointerType === 'touch') return;
      point = { x: e.clientX, y: e.clientY, target: e.target };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        cursor.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
        cursor.classList.add('is-visible');
        cursor.classList.toggle('is-link', Boolean(point.target.closest('a, button')));
        const next = point.target.closest('.material-card, .partner-card, .main-card');
        if (next !== card) { reset(); card = next; }
        if (!card) return;
        const r = card.getBoundingClientRect(), x = (point.x - r.left) / r.width, y = (point.y - r.top) / r.height;
        card.style.setProperty('--tilt-x', `${(0.5 - y) * 9}deg`);
        card.style.setProperty('--tilt-y', `${(x - 0.5) * 9}deg`);
        card.style.setProperty('--spot-x', `${x * 100}%`); card.style.setProperty('--spot-y', `${y * 100}%`);
        card.classList.add('pointer-active');
      });
    };
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('blur', hide); window.addEventListener('scroll', hide, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide); query.addEventListener('change', hide);
    return () => { hide(); window.removeEventListener('pointermove', move); window.removeEventListener('blur', hide); window.removeEventListener('scroll', hide); document.documentElement.removeEventListener('pointerleave', hide); query.removeEventListener('change', hide); };
  }, []);
  return <div className="cursor-aura" ref={ref} aria-hidden="true"><span /></div>;
}
