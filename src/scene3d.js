import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function initHeroScene(canvas) {
  if (!canvas || !window.WebGLRenderingContext) return false;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch { return false; }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.15, 8.5);
  const isMobile = window.matchMedia('(max-width: 639px)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const root = new THREE.Group();
  scene.add(root);
  const material = new THREE.MeshPhysicalMaterial({ color: 0xc98b77, metalness: 0.16, roughness: 0.17, transmission: 0.18, clearcoat: 0.7, clearcoatRoughness: 0.12, iridescence: 0.18 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xf8d4c7, metalness: 0.05, roughness: 0.11, transmission: 0.62, thickness: 0.4, clearcoat: 0.7, transparent: true, opacity: 0.9 });
  const points = [[0, -1.45, 0.38], [0.2, -1.25, 0.38], [0.28, -0.85, 0.36], [0.34, -0.15, 0.33], [0.3, 0.72, 0.25], [0.2, 1.12, 0.2], [0.12, 1.33, 0.18], [0.08, 1.5, 0.16]];
  const bottle = new THREE.Mesh(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), 48), glass);
  bottle.scale.set(1.25, 1, 1.25); root.add(bottle);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.22, 48), material); collar.position.y = 1.55; collar.scale.set(1.1, 1, 1.1); root.add(collar);
  const dropper = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.52, 48), material); dropper.position.y = 1.88; root.add(dropper);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.18, 48), material); cap.position.y = 2.22; root.add(cap);
  const pearlMat = new THREE.MeshPhysicalMaterial({ color: 0xf2e9dc, roughness: 0.1, metalness: 0.06, clearcoat: 0.8 });
  const pearls = new THREE.Group(); root.add(pearls);
  const pearlCount = isMobile ? 5 : 8;
  for (let i = 0; i < pearlCount; i++) { const angle = (i / pearlCount) * Math.PI * 2; const radius = 1.7 + (i % 3) * 0.18; const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.11 + (i % 3) * 0.035, isMobile ? 14 : 24, isMobile ? 10 : 16), pearlMat); pearl.position.set(Math.cos(angle) * radius, -0.7 + Math.sin(angle * 1.7) * 1.1, Math.sin(angle) * 0.48); pearls.add(pearl); }
  const dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xb8935a, size: isMobile ? 0.035 : 0.028, transparent: true, opacity: 0.7 }));
  const dustPositions = []; for (let i = 0; i < (isMobile ? 60 : 120); i++) dustPositions.push((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2); dust.geometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3)); scene.add(dust);
  const light = new THREE.DirectionalLight(0xffe7d5, 2.2); light.position.set(3, 5, 5); scene.add(light); scene.add(new THREE.HemisphereLight(0xfff6ef, 0xcba996, 1.4));
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, visible = true, raf;
  const resize = () => { const box = canvas.getBoundingClientRect(); if (!box.width || !box.height) return; camera.aspect = box.width / box.height; camera.updateProjectionMatrix(); renderer.setSize(box.width, box.height, false); };
  const pointer = (event) => { pointerX = (event.clientX / window.innerWidth - 0.5) * 0.7; pointerY = (event.clientY / window.innerHeight - 0.5) * 0.4; };
  const render = (time = 0) => { if (!visible) return; targetX += (pointerX - targetX) * 0.04; targetY += (pointerY - targetY) * 0.04; root.rotation.y = targetX + Math.sin(time * 0.00035) * 0.08; root.rotation.x = targetY * 0.25 + Math.sin(time * 0.0007) * 0.025; pearls.rotation.y = -time * 0.00015; dust.rotation.y = time * 0.00003; renderer.render(scene, camera); raf = requestAnimationFrame(render); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(render); if (!visible && raf) { cancelAnimationFrame(raf); raf = null; } }, { threshold: 0.02 }); observer.observe(canvas);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement || canvas);
  window.addEventListener('pointermove', pointer, { passive: true });
  resize(); raf = requestAnimationFrame(render);
  return true;
}
