import { useEffect, useRef, useState } from 'react';
import PaintScene from './PaintScene';
import './ColorStudio.css';

const colors = [
  { name: 'Sage Retreat', value: '#8ca997' },
  { name: 'Terracotta', value: '#c77e64' },
  { name: 'Ocean Mist', value: '#749bb5' },
  { name: 'Golden Hour', value: '#d6b56c' },
  { name: 'Soft Linen', value: '#d9cdb8' },
  { name: 'Dusty Lilac', value: '#aa97b4' },
];
const layers = [
  ['Masonry', 'The structural base', '#706d69'],
  ['Plaster', 'A smooth, even surface', '#b0a397'],
  ['Primer', 'Prepares the surface for color', '#e2dfd5'],
  ['Paint', 'The finishing touch', '#ea8558'],
];

export default function ColorStudio() {
  const [selected, setSelected] = useState(0);
  const scrollRef = useRef(null);
  useEffect(() => {
    const node = scrollRef.current;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const progress = motion.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.85 - rect.top) / (innerHeight * 0.8)));
      node.style.setProperty('--progress', progress);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue); motion.addEventListener('change', queue); update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); motion.removeEventListener('change', queue); };
  }, []);
  return <>
    <section className="color-studio section-padding" id="color-studio">
      <div className="container">
        <div className="studio-heading"><span className="studio-eyebrow">THE COLOR STUDIO</span><h2 className="heading-lg">Find a feeling. Give it a color.</h2><p className="text-body-lg">Explore the palette and see your room in a new light.</p></div>
        <div className="studio-grid glass-panel">
          <div className="room-preview"><div className="scene-caption"><span>01 / YOUR SPACE</span><span aria-live="polite">{colors[selected].name}</span></div><PaintScene kind="room" color={colors[selected].value} /><p className="preview-note">Illustrative colors. Ask us for physical shade cards to choose your finish.</p></div>
          <div className="palette-panel"><span className="studio-eyebrow">02 / YOUR PALETTE</span><h3 className="heading-md">A little color.<br />A whole new room.</h3><p className="text-secondary">Hover or focus to unfold. Select a shade to paint the walls.</p>
            <div className="color-fan" role="group" aria-label="Room wall colors">
              {colors.map((color, index) => <button key={color.name} type="button" className={`fan-swatch ${selected === index ? 'selected' : ''}`} style={{ '--swatch': color.value, '--index': index }} aria-label={`Paint room ${color.name}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span className="swatch-number">0{index + 1}</span><span className="swatch-name">{color.name}</span><span className="swatch-pin" /></button>)}
            </div>
            <p className="selected-shade" aria-live="polite"><span style={{ background: colors[selected].value }} />{colors[selected].name}<small>{colors[selected].value.toUpperCase()}</small></p>
          </div>
        </div>
      </div>
    </section>
    <section className="ribbon-section"><div className="container ribbon-layout"><div><span className="studio-eyebrow">BOUNDLESS POSSIBILITIES</span><h2 className="heading-lg">Let your ideas flow.</h2><p className="text-secondary">Move across the paint to make a little wave.</p></div><PaintScene kind="ribbon" /></div></section>
    <section className="finish-section section-padding" ref={scrollRef}>
      <div className="container"><div className="studio-heading"><span className="studio-eyebrow">BEAUTY, LAYER BY LAYER</span><h2 className="heading-lg">A beautiful finish starts beneath.</h2><p className="text-body-lg">Scroll to explore the layers, then watch the color roll on.</p></div>
        <div className="finish-grid">
          <div className="layers-panel glass-panel"><div className="wall-stack" aria-hidden="true">{layers.map(([name, , color], i) => <div key={name} className="wall-layer" style={{ '--layer': i, '--layer-color': color }}><span>0{i + 1}</span></div>)}</div><ol className="layer-legend">{layers.map(([name, description, color]) => <li key={name}><i style={{ background: color }} /><div><strong>{name}</strong><span>{description}</span></div></li>)}</ol></div>
          <div className="roller-panel glass-panel"><div className="roller-wall" aria-hidden="true"><div className="paint-stroke" /><div className="paint-roller"><div className="roller-head" /><div className="roller-arm" /><div className="roller-handle" /></div></div><div className="roller-copy"><span className="studio-eyebrow">THE FINAL PASS</span><h3 className="heading-md">From blank to beautiful.</h3><p className="text-secondary">Color, materials, and professional application for a finish that feels like you.</p><a className="btn btn-outline" href="#contact">Plan your project <span aria-hidden="true">↗</span></a></div></div>
        </div>
      </div>
    </section>
  </>;
}
