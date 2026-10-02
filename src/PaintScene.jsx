import { useEffect, useRef, useState } from 'react';

// Each visible scene owns its resources and sleeps when outside the viewport.
export default function PaintScene({ kind = 'can', color = '#8ca997' }) {
  const hostRef = useRef(null);
  const colorRef = useRef(color);
  const updateRef = useRef(() => {});
  const [lidOpen, setLidOpen] = useState(false);
  const lidRef = useRef(false);
  useEffect(() => { colorRef.current = color; updateRef.current(); }, [color]);
  useEffect(() => { lidRef.current = lidOpen; updateRef.current(); }, [lidOpen]);
  useEffect(() => {
    const host = hostRef.current;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let cancelled = false, cleanup = () => {};
    async function setup() {
      const T = await import('three');
      if (cancelled) return;
      let renderer;
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0.7, 8);
      camera.lookAt(0, 0, 0);
      scene.add(new T.HemisphereLight(0xffffff, 0x59505a, 3));
      const light = new T.DirectionalLight(0xffeedc, 4);
      light.position.set(-3, 5, 6); scene.add(light);
      const fill = new T.DirectionalLight(0x8ebeff, 2);
      fill.position.set(4, 1, -2); scene.add(fill);
      const group = new T.Group(); scene.add(group);
      const materials = [], geometries = [], textures = [];
      const mat = (color, extra = {}) => { const m = new T.MeshStandardMaterial({ color, roughness: 0.4, ...extra }); materials.push(m); return m; };
      const mesh = (geometry, material, position = [0, 0, 0], parent = group) => {
        geometries.push(geometry); const object = new T.Mesh(geometry, material); object.position.set(...position); parent.add(object); return object;
      };
      const box = (size, material, position) => mesh(new T.BoxGeometry(...size), material, position);
      let lid, wallMaterial, ribbonGeometry;
      if (kind === 'can') {
        const metal = mat('#c4c9ce', { metalness: 0.85, roughness: 0.25 });
        const label = document.createElement('canvas'); label.width = 1024; label.height = 512;
        const ctx = label.getContext('2d');
        ctx.fillStyle = '#102341'; ctx.fillRect(0, 0, 1024, 512);
        ctx.fillStyle = '#f66b2b'; ctx.fillRect(0, 350, 1024, 162);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
        ctx.font = 'bold 53px sans-serif'; ctx.fillText('BHAVESH', 512, 165);
        ctx.font = '30px sans-serif'; ctx.fillText('E N T E R P R I S E', 512, 220);
        ctx.font = '22px sans-serif'; ctx.fillText('A WORLD OF COLOR', 512, 300);
        ctx.font = 'bold 25px sans-serif'; ctx.fillText('PAINT • BUILD • BEAUTIFY', 512, 414);
        const texture = new T.CanvasTexture(label); texture.colorSpace = T.SRGBColorSpace; textures.push(texture);
        const labelMat = mat('#ffffff', { map: texture, roughness: 0.3 });
        const body = mesh(new T.CylinderGeometry(0.98, 0.88, 2.15, 64, 1, true), labelMat);
        body.rotation.y = Math.PI;
        mesh(new T.CylinderGeometry(0.89, 0.89, 0.08, 64), metal, [0, -1.08, 0]);
        mesh(new T.CylinderGeometry(0.94, 0.94, 0.04, 64), mat('#ff6d36'), [0, 0.93, 0]);
        const rim = mesh(new T.TorusGeometry(0.98, 0.04, 12, 64), metal, [0, 1.07, 0]); rim.rotation.x = Math.PI / 2;
        lid = new T.Group(); group.add(lid); lid.position.y = 1.12;
        mesh(new T.CylinderGeometry(1.02, 1.02, 0.09, 64), metal, [0, 0, 0], lid);
        const handle = mesh(new T.TorusGeometry(1.02, 0.025, 8, 64, Math.PI), metal, [0, 0.15, 0]); handle.rotation.y = 0.18;
        group.rotation.set(0.12, 0.25, -0.08);
      } else if (kind === 'room') {
        camera.position.set(5.5, 4.1, 7); camera.lookAt(0, 0, 0);
        wallMaterial = mat(colorRef.current);
        box([4.5, 2.7, 0.12], wallMaterial, [0, 0.35, -1.65]);
        box([0.12, 2.7, 3.5], wallMaterial, [-2.2, 0.35, 0]);
        box([4.5, 0.12, 3.5], mat('#be9b73'), [0, -1, 0]);
        const trim = mat('#eee9dd');
        box([4.35, 0.1, 0.08], trim, [0, -0.86, -1.55]);
        box([0.08, 0.1, 3.3], trim, [-2.1, -0.86, 0]);
        const sofa = mat('#e8dfd1');
        box([2.5, 0.48, 0.95], sofa, [-0.2, -0.53, -0.75]);
        box([2.5, 0.7, 0.25], sofa, [-0.2, -0.14, -1.16]);
        [-1.35, 0.95].forEach(x => box([0.22, 0.65, 1], sofa, [x, -0.35, -0.75]));
        box([0.5, 0.42, 0.18], mat('#c57349'), [-0.8, -0.1, -0.95]);
        box([0.5, 0.42, 0.18], mat('#626e5d'), [0.45, -0.1, -0.95]);
        box([2.7, 0.03, 1.5], mat('#e5d6bc'), [0, -0.91, 0.55]);
        mesh(new T.CylinderGeometry(0.57, 0.57, 0.1, 40), mat('#644939'), [0.1, -0.48, 0.5]);
        mesh(new T.CylinderGeometry(0.12, 0.2, 0.45, 24), mat('#302b28'), [0.1, -0.72, 0.5]);
        box([0.95, 0.95, 0.05], mat('#d5b68d'), [0.05, 0.85, -1.54]);
        box([0.79, 0.79, 0.06], trim, [0.05, 0.85, -1.50]);
        mesh(new T.CircleGeometry(0.25, 40), mat('#bc694a'), [0.05, 0.85, -1.46]);
        mesh(new T.CylinderGeometry(0.23, 0.17, 0.4, 24), trim, [1.65, -0.75, -1]);
        const green = mat('#465f42');
        for (let i = 0; i < 7; i++) {
          const leaf = mesh(new T.SphereGeometry(0.18, 16, 12), green, [1.65 + Math.sin(i * 2) * 0.19, -0.25 + i * 0.09, -1 + Math.cos(i * 2) * 0.12]); leaf.scale.set(0.6, 2.2, 0.65); leaf.rotation.z = Math.sin(i) * 0.6;
        }
      } else {
        camera.position.set(0, 0, 7);
        ribbonGeometry = new T.PlaneGeometry(7, 0.65, 110, 10);
        const ribbon = mesh(ribbonGeometry, mat('#ff6b2c', { metalness: 0.35, side: T.DoubleSide }));
        ribbon.rotation.z = -0.1;
        const second = mesh(ribbonGeometry.clone(), mat('#2584ee', { metalness: 0.4, side: T.DoubleSide }));
        second.position.z = -0.35; second.rotation.z = 0.1;
      }
      const target = new T.Vector2();
      let visible = true, time = 0, previous = 0, rotation = 0.25, dragX = null, hover = false, contextLost = false;
      const draw = (now = 0) => {
        const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0; previous = now;
        if (!motion.matches) time += dt;
        if (kind === 'can') {
          group.rotation.y += (rotation - group.rotation.y) * (motion.matches ? 1 : 0.12);
          const open = lidRef.current || (!motion.matches && hover);
          lid.position.y += ((open ? 1.85 : 1.12) - lid.position.y) * (motion.matches ? 1 : 0.1);
          lid.rotation.z = (lid.position.y - 1.12) * -0.2;
          group.position.y = motion.matches ? 0 : Math.sin(time * 0.8) * 0.07;
        } else if (kind === 'room') {
          wallMaterial.color.set(colorRef.current);
          group.rotation.y += (target.x * 0.1 - group.rotation.y) * 0.05;
        } else {
          group.children.forEach((ribbon, index) => {
            const positions = ribbon.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
              const x = positions.getX(i), row = Math.floor(i / 111);
              positions.setY(i, (0.5 - row / 10) * 0.65 + Math.sin(x * 1.3 + time + index * 2) * 0.5 + target.y * 0.25);
              positions.setZ(i, Math.cos(x * 1.1 + time + index * 2) * 0.45 + target.x * x * 0.08);
            }
            positions.needsUpdate = true; ribbon.geometry.computeVertexNormals();
          });
        }
        renderer.render(scene, camera);
      };
      const sync = () => { previous = 0; renderer.setAnimationLoop(visible && !document.hidden && !motion.matches && !contextLost ? draw : null); if (visible && !document.hidden && !contextLost) draw(); };
      updateRef.current = () => { if (!contextLost) draw(); };
      const resize = new ResizeObserver(() => { const { width, height } = host.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); if (!contextLost) draw(); }); resize.observe(host);
      const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }); observer.observe(host);
      const move = e => {
        if (dragX !== null && kind === 'can') { rotation += (e.clientX - dragX) * 0.012; dragX = e.clientX; }
        if (!motion.matches) { const r = host.getBoundingClientRect(); target.set((e.clientX - r.left) / r.width * 2 - 1, 1 - (e.clientY - r.top) / r.height * 2); }
        if (motion.matches) draw();
      };
      const down = e => { if (kind !== 'can') return; dragX = e.clientX; host.setPointerCapture(e.pointerId); };
      const up = () => { dragX = null; };
      const enter = () => { hover = true; };
      const leave = () => { hover = false; target.set(0, 0); };
      const key = e => { if (kind !== 'can' || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return; e.preventDefault(); rotation += e.key === 'ArrowLeft' ? -0.3 : 0.3; draw(); };
      const lost = e => { e.preventDefault(); contextLost = true; renderer.setAnimationLoop(null); host.classList.remove('scene-ready'); };
      const restored = () => { contextLost = false; host.classList.add('scene-ready'); sync(); };
      const events = { pointermove: move, pointerdown: down, pointerup: up, pointercancel: up, lostpointercapture: up, pointerenter: enter, pointerleave: leave, keydown: key };
      Object.entries(events).forEach(([name, fn]) => host.addEventListener(name, fn));
      renderer.domElement.addEventListener('webglcontextlost', lost); renderer.domElement.addEventListener('webglcontextrestored', restored);
      document.addEventListener('visibilitychange', sync); motion.addEventListener('change', sync);
      host.classList.add('scene-ready'); sync();
      cleanup = () => {
        updateRef.current = () => {}; renderer.setAnimationLoop(null); resize.disconnect(); observer.disconnect();
        Object.entries(events).forEach(([name, fn]) => host.removeEventListener(name, fn));
        renderer.domElement.removeEventListener('webglcontextlost', lost); renderer.domElement.removeEventListener('webglcontextrestored', restored);
        document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync);
        geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); renderer.dispose(); renderer.domElement.remove(); host.classList.remove('scene-ready');
      };
    }
    setup().catch(() => {});
    return () => { cancelled = true; cleanup(); };
  }, [kind]);
  return <div className={`scene-wrap scene-${kind}`}>
    <div ref={hostRef} className="paint-scene" tabIndex={kind === 'can' ? 0 : undefined} role="img" aria-label={kind === 'can' ? 'Bhavesh Enterprise paint can. Drag or use left and right arrow keys to rotate.' : kind === 'room' ? 'Three-dimensional living room in the selected wall color' : 'Flowing orange and blue paint ribbons'}>
      <div className={`scene-fallback fallback-${kind}`} style={{ '--room-color': color }}><span>{kind === 'can' ? 'BHAVESH\nENTERPRISE' : kind === 'room' ? 'Your color, your space' : 'COLOR IN MOTION'}</span></div>
    </div>
    {kind === 'can' && <div className="scene-controls"><span>Drag to rotate · Hover to lift the lid</span><button type="button" aria-pressed={lidOpen} onClick={() => setLidOpen(!lidOpen)}>{lidOpen ? 'Close lid' : 'Lift lid'}</button></div>}
  </div>;
}
