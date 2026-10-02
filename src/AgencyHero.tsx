import { useEffect, useRef, useState } from 'react';
import './AgencyHero.css';

const EMAIL = 'bnshah2008@gmail.com';
const intro = 'Transform your space with vibrant colors & strong foundations. Now, what are we building?';
const links = [['Brands', '#brands'], ['Color Studio', '#color-studio'], ['Materials', '#materials']] as const;

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let interval: ReturnType<typeof setInterval> | undefined;
    const finish = () => { if (motion.matches) { clearInterval(interval); setCount(text.length); } };
    const delay = setTimeout(() => {
      if (motion.matches) { finish(); return; }
      let index = 0;
      interval = setInterval(() => { index++; setCount(index); if (index >= text.length) clearInterval(interval); }, speed);
    }, startDelay);
    motion.addEventListener('change', finish);
    return () => { clearTimeout(delay); clearInterval(interval); motion.removeEventListener('change', finish); };
  }, [text, speed, startDelay]);
  return { displayed: text.slice(0, count), done: count >= text.length };
}

export default function AgencyHero() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const { displayed, done } = useTypewriter(intro);
  useEffect(() => {
    const backdrop = backdropRef.current!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let x = 0, y = 0;
    const render = () => {
      frame = 0;
      backdrop.style.setProperty('--painter-x', `${x}px`);
      backdrop.style.setProperty('--painter-y', `${y}px`);
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || event.pointerType !== 'mouse' || document.hidden || window.scrollY > innerHeight) return;
      x = (event.clientX / innerWidth - 0.5) * -18;
      y = (event.clientY / innerHeight - 0.5) * -10;
      if (!frame) frame = requestAnimationFrame(render);
    };
    const reset = () => { cancelAnimationFrame(frame); frame = 0; x = 0; y = 0; render(); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', reset);
      document.documentElement.removeEventListener('pointerleave', reset);
      motion.removeEventListener('change', reset);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const close = () => { setMenuOpen(false); toggleRef.current?.focus(); };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;
      const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
      const index = items.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0].focus(); }
    };
    const resize = () => { if (innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('keydown', key); window.addEventListener('resize', resize);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', key); window.removeEventListener('resize', resize); };
  }, [menuOpen]);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopyStatus('Email copied'); }
    catch { setCopyStatus(`Copy this email: ${EMAIL}`); }
  };
  return <>
    <div ref={backdropRef} className="agency-backdrop painter-backdrop" aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}painter-hero.png`} alt="" fetchPriority="high" />
    </div>
    <nav className="agency-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5" aria-label="Main navigation">
      <a href="#home" className="agency-logo" aria-label="Bhavesh Enterprise home">Bhavesh Enterprise <span aria-hidden="true">✳︎</span></a>
      <div className="agency-desktop-links hidden md:flex">{links.map(([label, href], index) => <span key={href}><a href={href}>{label}</a>{index < links.length - 1 ? ', ' : ''}</span>)}</div>
      <a className="agency-contact hidden md:inline" href="#contact">Get in touch</a>
      <button type="button" ref={toggleRef} className={`agency-menu-toggle md:hidden ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
    </nav>
    <div ref={menuRef} id="mobile-navigation" className={`agency-mobile-menu md:hidden ${menuOpen ? 'is-open' : ''}`} inert={!menuOpen} aria-hidden={!menuOpen}>{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<a href="#contact" onClick={() => setMenuOpen(false)}>Get in touch</a><a href="tel:+919824061453">+91 9824061453</a></div>
    <header id="home" className="agency-hero relative flex flex-col overflow-hidden px-5 sm:px-8 md:px-10">
      <div className="agency-hero-content relative">
        <div className="agency-intro" aria-hidden="true">Hey there, meet Bhavesh Enterprise,<br />your partner in paint & building materials.</div>
        <h1 className="agency-typewriter"><span className="sr-only">{intro}</span><span aria-hidden="true">{displayed}{!done && <span className="typing-caret" />}</span></h1>
        <div className="agency-actions flex flex-wrap">
          <a href="#color-studio" className="agency-pill">Find your color</a><a href="#materials" className="agency-pill">Explore materials</a><a href="https://wa.me/919824061453" target="_blank" rel="noreferrer" className="agency-pill">Send a brief hello</a><a href="#brands" className="agency-pill">Meet our brands</a>
          <button type="button" className="agency-pill agency-email" onClick={copyEmail}>Reach us: <span>{EMAIL}</span><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1" /><path d="M10 3V2H2v8h1" /></svg></button>
        </div>
        <p className="copy-status" role="status">{copyStatus}</p>
      </div>
      <div className="agency-hero-footer"><span>AUTHORISED DEALERS · VADODARA, INDIA</span><a href="#brands">Discover more <span aria-hidden="true">↓</span></a><span className="scrub-hint">A fresh perspective on color</span></div>
    </header>
  </>;
}
