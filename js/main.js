/* =========================================================
   Script principal: navegação, contagem regressiva, mapa,
   calendário, animações de entrada e pétalas decorativas.
   ========================================================= */

/* ---------- Loader ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("hidden");
});

/* ---------- Pétalas flutuantes ---------- */
function createPetals() {
  const container = document.getElementById("petals");
  if (!container) return;
  const total = window.innerWidth < 760 ? 10 : 20;

  for (let i = 0; i < total; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.width = petal.style.height = 6 + Math.random() * 8 + "px";
    petal.style.animationDuration = 10 + Math.random() * 12 + "s";
    petal.style.animationDelay = Math.random() * 12 + "s";
    petal.style.opacity = 0.3 + Math.random() * 0.4;
    container.appendChild(petal);
  }
}

/* ---------- Navbar: fundo ao rolar + menu mobile ---------- */
function setupNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

/* ---------- Revelar elementos ao rolar ----------
   Exposto como global (não dentro de DOMContentLoaded) porque
   js/gifts.js precisa reutilizá-lo para os cards de presente,
   que são inseridos dinamicamente depois de um fetch. */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function setupScrollReveal() {
  document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));
}

/* ---------- Contagem regressiva ---------- */
function setupCountdown() {
  const target = new Date(WEDDING_DATA.event.date).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };
  if (!els.days) return;

  function tick() {
    const diff = Math.max(target - Date.now(), 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    els.days.textContent = String(days).padStart(2, "0");
    els.hours.textContent = String(hours).padStart(2, "0");
    els.minutes.textContent = String(minutes).padStart(2, "0");
    els.seconds.textContent = String(seconds).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------- Mapa e link externo ---------- */
function setupMap() {
  const query = encodeURIComponent(WEDDING_DATA.event.fullAddressForMaps);
  const mapFrame = document.getElementById("mapFrame");
  const mapLink = document.getElementById("mapLink");
  if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${query}&output=embed`;
  if (mapLink) mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/* ---------- Adicionar ao calendário (.ics) ---------- */
function setupAddToCalendar() {
  const btn = document.getElementById("addCalendarBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const start = new Date(WEDDING_DATA.event.date);
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
    const toICSDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:Casamento de ${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride}`,
      `LOCATION:${WEDDING_DATA.event.venueName} - ${WEDDING_DATA.event.address}`,
      "DESCRIPTION:Venha celebrar o nosso grande dia!",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "casamento-dhiogo-laura.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/* ---------- Botão voltar ao topo ---------- */
function setupBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
  createPetals();
  setupNavbar();
  setupScrollReveal();
  setupCountdown();
  setupMap();
  setupAddToCalendar();
  setupBackToTop();
});
