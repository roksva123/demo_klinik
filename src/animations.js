import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);
export function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000)); gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('.reveal').forEach((el) => { gsap.fromTo(el, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }); });
  document.querySelectorAll('.split-reveal').forEach((el) => { gsap.fromTo(el, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, delay: 0.18, ease: 'power4.out' }); });
  document.querySelectorAll('.image-arch img').forEach((img) => { gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: img, start: 'top 90%', once: true } }); });
  gsap.utils.toArray('.hero-stage').forEach((stage) => gsap.to(stage, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));
  return lenis;
}
export function initHeader() {
  let last = 0; const header = document.querySelector('[data-header]');
  window.addEventListener('scroll', () => { const current = window.scrollY; header.classList.toggle('scrolled', current > 40); header.classList.toggle('hide', current > last && current > 180); last = current; }, { passive: true });
}
export function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic').forEach((button) => { button.addEventListener('pointermove', (event) => { const r = button.getBoundingClientRect(); const x = (event.clientX - r.left - r.width / 2) * 0.12; const y = (event.clientY - r.top - r.height / 2) * 0.12; button.style.transform = `translate(${x}px, ${y}px)`; }); button.addEventListener('pointerleave', () => { button.style.transform = ''; }); });
  const cursor = document.querySelector('.custom-cursor'); window.addEventListener('pointermove', (e) => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; }); document.querySelectorAll('a, button, select, input, .gallery-item, .doctor-card').forEach((el) => { el.addEventListener('mouseenter', () => cursor.classList.add('active')); el.addEventListener('mouseleave', () => cursor.classList.remove('active')); });
}
export function animateCounter(el, end, decimal = false) { const duration = 1300; const start = performance.now(); const tick = (now) => { const progress = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - progress, 3); const value = end * eased; el.textContent = decimal ? value.toFixed(1) : Math.floor(value).toLocaleString('id-ID') + (end > 100 ? '+' : '+'); if (progress < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
