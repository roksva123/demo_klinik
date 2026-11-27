import './style.css';
import { treatments, doctors, gallery, formatPrice } from './data.js';
import { initHeroScene } from './scene3d.js';
import { initAnimations, initHeader, initMagnetic, animateCounter } from './animations.js';
import { initBooking } from './booking.js';

const treatmentList = document.querySelector('#treatment-list');
function renderTreatments(filter = 'Semua') {
  const items = filter === 'Semua' ? treatments : treatments.filter((t) => t.category === filter);
  treatmentList.innerHTML = items.map((t, index) => `<article class="treatment-row reveal" style="--delay:${index * 0.04}s"><div class="treatment-number">0${index + 1}</div><div class="treatment-main"><h3>${t.name}</h3><p>${t.tagline}</p></div><div class="treatment-detail"><span>${t.category}</span><span>${t.duration}</span><strong>${formatPrice(t.price)}</strong></div><button class="row-arrow" data-book-treatment="${t.id}" aria-label="Booking ${t.name}">↗</button></article>`).join('');
  treatmentList.querySelectorAll('[data-book-treatment]').forEach((button) => button.addEventListener('click', () => { document.querySelector('a[href="#booking"]').click(); }));
}
function renderDoctors() {
  document.querySelector('#doctor-grid').innerHTML = doctors.map((d, i) => `<article class="doctor-card reveal" data-doctor="${d.id}"><div class="doctor-image image-arch"><img loading="lazy" src="${d.image}" alt="${d.name}, ${d.specialty}" /><span>0${i + 1}</span></div><div class="doctor-info"><h3>${d.shortName}</h3><p>${d.title ? `${d.title} · ` : ''}${d.specialty}</p><button type="button" class="text-link">View profile <span>↗</span></button></div></article>`).join('');
  document.querySelector('#menu-doctors').innerHTML = doctors.map((d) => `<button class="menu-doctor-thumb" type="button" data-doctor="${d.id}" aria-label="Lihat profil ${d.name}"><img loading="lazy" src="${d.image}" alt="${d.name}" /><span><b>${d.shortName}</b><small>${d.specialty}</small></span></button>`).join('');
  document.querySelectorAll('[data-doctor]').forEach((card) => card.addEventListener('click', () => openDoctor(card.dataset.doctor)));
}
function openDoctor(id) { const d = doctors.find((doctor) => doctor.id === id); document.querySelector('#doctor-detail').innerHTML = `<div class="doctor-detail-image image-arch"><img src="${d.image}" alt="${d.name}" /></div><div class="doctor-detail-copy"><p class="eyebrow">${d.specialty}</p><h2>${d.name}<br /><i>${d.title || ''}</i></h2><p>${d.experience} pengalaman · ${d.education}</p><div class="detail-block"><span>Specializes in</span><p>${d.treatments.join(' · ')}</p></div><div class="detail-block"><span>Practice hours</span><p>${d.schedule.map((s) => `${s.day} ${s.time}`).join('<br />')}</p></div><div class="detail-block"><span>Certifications</span><p>${d.certifications.join('<br />')}</p></div></div>`; const modal = document.querySelector('#doctor-modal'); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); }
function renderGallery() { document.querySelector('#gallery-grid').innerHTML = gallery.map((item) => `<button class="gallery-item ${item.className}" type="button" data-src="${item.src}" data-caption="${item.caption}"><img loading="lazy" src="${item.src}" alt="${item.caption}" /><span>${item.caption} ↗</span></button>`).join(''); document.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => { document.querySelector('#lightbox-image').src = item.dataset.src; document.querySelector('#lightbox-image').alt = item.dataset.caption; document.querySelector('#lightbox-caption').textContent = item.dataset.caption; document.querySelector('#lightbox').classList.add('open'); })); }
function renderSchedule() {
  const body = document.querySelector('#schedule-body');
  const mobile = document.querySelector('#schedule-mobile');
  const doctorSelect = document.querySelector('#schedule-doctor');
  doctorSelect.insertAdjacentHTML('beforeend', doctors.map((d) => `<option value="${d.id}">${d.shortName}</option>`).join(''));
  const update = () => {
    const selectedDoctor = doctorSelect.value;
    const selectedDay = document.querySelector('#schedule-day').value;
    const visibleDoctors = doctors.filter((d) => selectedDoctor === 'Semua' || d.id === selectedDoctor);
    const rows = visibleDoctors.flatMap((d) => d.schedule.map((s) => ({ ...s, doctor: d }))).filter((r) => selectedDay === 'Semua' || r.day === selectedDay);
    body.innerHTML = rows.map((r) => `<tr><td><b>${r.doctor.shortName}</b><small>${r.doctor.title || r.doctor.specialty}</small></td><td>${r.day}</td><td>${r.time}</td><td><span class="status-dot">Available</span></td></tr>`).join('');
    mobile.innerHTML = visibleDoctors.map((d) => { const entries = d.schedule.filter((s) => selectedDay === 'Semua' || s.day === selectedDay); return `<details><summary><strong>${d.shortName}</strong><span>${entries.length} jadwal</span></summary>${entries.map((s) => `<div class="schedule-entry"><span>${s.day}</span><b>${s.time}</b><span class="status-dot">Available</span></div>`).join('')}</details>`; }).join('');
  };
  doctorSelect.addEventListener('change', update);
  document.querySelector('#schedule-day').addEventListener('change', update);
  update();
}
function initMenu() {
  const overlay = document.querySelector('.menu-overlay');
  const toggle = document.querySelector('.menu-toggle');
  const close = document.querySelector('.menu-close');
  const setOpen = (open) => {
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('modal-open', open);
    document.querySelector('.custom-cursor')?.classList.toggle('menu-hidden', open);
  };
  toggle.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  overlay.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  const changeMenuImage = (image) => {
    const target = document.querySelector('#menu-image');
    if (!target || !image || target.src.includes(image)) return;
    target.classList.add('is-changing');
    window.setTimeout(() => { target.src = image; target.onload = () => target.classList.remove('is-changing'); }, 120);
  };
  overlay.querySelectorAll('.menu-links a').forEach((link) => link.addEventListener('mouseenter', () => changeMenuImage(link.dataset.menuImage)));
  overlay.querySelectorAll('.menu-doctor-thumb').forEach((card) => card.addEventListener('mouseenter', () => { const doctor = doctors.find((item) => item.id === card.dataset.doctor); changeMenuImage(doctor?.image); }));
}
function initLightbox() { const lightbox = document.querySelector('#lightbox'); const close = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); }; document.querySelector('.lightbox-close').addEventListener('click', close); lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); }); }
function initCountdown() { const root = document.querySelector('[data-deadline]'); const tick = () => { const diff = Math.max(0, new Date(root.dataset.deadline) - Date.now()); const values = { days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60 }; Object.entries(values).forEach(([key, value]) => { root.querySelector(`[data-time="${key}"]`).textContent = String(value).padStart(2, '0'); }); }; tick(); setInterval(tick, 60000); }
function initCounters() { const observer = new IntersectionObserver((entries, obs) => { entries.forEach((entry) => { if (entry.isIntersecting) { animateCounter(entry.target, Number(entry.target.dataset.count), entry.target.dataset.decimal === 'true'); obs.unobserve(entry.target); } }); }, { threshold: 0.8 }); document.querySelectorAll('[data-count]').forEach((el) => observer.observe(el)); }
function initGlobalClose() { document.querySelectorAll('.doctor-modal .modal-close').forEach((button) => button.addEventListener('click', () => { document.querySelector('#doctor-modal').classList.remove('open'); document.body.classList.remove('modal-open'); })); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { document.querySelectorAll('.open').forEach((el) => { if (el.classList.contains('booking-modal') || el.classList.contains('doctor-modal') || el.classList.contains('lightbox') || el.classList.contains('menu-overlay')) el.classList.remove('open'); }); document.body.classList.remove('modal-open'); } }); }

renderTreatments(); renderDoctors(); renderGallery(); renderSchedule(); initBooking(); initMenu(); initLightbox(); initCountdown(); initCounters(); initGlobalClose(); initHeader(); initMagnetic(); initAnimations(); initHeroScene(document.querySelector('#hero-canvas'));
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderTreatments(button.dataset.filter); }));
