/* =========================================================
   Lista de Presentes - renderização e reserva
   Fonte de verdade: aba "Presentes" da Planilha Google
   (configurada em js/config.js). Sem SHEETS_API_URL, cai em
   modo demonstração local (localStorage) usando os itens de
   js/data.js, só para visualizar o site antes do setup.
   ========================================================= */

const GIFTS_DEMO_STORAGE_KEY = "wedding_reserved_gifts_demo";

function usingSheetsBackend() {
  return Boolean(SHEETS_API_URL);
}

function isGiftAvailable(status) {
  const s = String(status || "").trim().toLowerCase();
  return !s || s === "disponível" || s === "disponivel";
}

function getDemoReservations() {
  try {
    return JSON.parse(localStorage.getItem(GIFTS_DEMO_STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveDemoReservation(giftName, guestName) {
  const reserved = getDemoReservations();
  reserved[giftName] = guestName;
  localStorage.setItem(GIFTS_DEMO_STORAGE_KEY, JSON.stringify(reserved));
}

async function fetchGifts() {
  if (usingSheetsBackend()) {
    const res = await fetch(`${SHEETS_API_URL}?action=getGifts`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Erro ao buscar presentes");
    return data.gifts.map((g) => ({
      name: g.Nome,
      description: g.Descricao,
      price: g.Preco,
      image: g.Imagem || "assets/images/brasao.png",
      status: g.Status,
      givenBy: g.DadoPor,
    }));
  }

  const demo = getDemoReservations();
  return WEDDING_DATA.gifts.map((g) => ({
    name: g.name,
    description: g.description,
    price: g.price,
    image: g.image,
    status: demo[g.name] ? "Reservado" : "",
    givenBy: demo[g.name] || "",
  }));
}

async function renderGifts() {
  const grid = document.getElementById("giftsGrid");
  if (!grid) return;

  let gifts;
  try {
    gifts = await fetchGifts();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="gifts-error">Não foi possível carregar a lista de presentes agora. Tente novamente em alguns instantes.</p>`;
    return;
  }

  grid.innerHTML = gifts
    .map((gift, index) => {
      const available = isGiftAvailable(gift.status);
      return `
        <div class="gift-card" data-reveal style="transition-delay:${(index % 4) * 0.08}s">
          <div class="gift-image-wrap">
            <img src="${gift.image}" alt="${gift.name}" />
          </div>
          <div class="gift-info">
            <h3 class="gift-name">${gift.name}</h3>
            <p class="gift-desc">${gift.description}</p>
            <span class="gift-price">${gift.price}</span>
            ${
              available
                ? `<button class="gift-btn" data-gift-name="${gift.name}">Presentear</button>`
                : `<span class="gift-reserved-tag">${gift.status || "Reservado"}${gift.givenBy ? " por " + gift.givenBy : ""} 💜</span>
                   <button class="gift-btn reserved" disabled>Indisponível</button>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  grid.querySelectorAll(".gift-btn:not(.reserved)").forEach((btn) => {
    btn.addEventListener("click", () => openGiftModal(btn.dataset.giftName));
  });

  document.querySelectorAll(".gift-card[data-reveal]").forEach((el) => revealObserver.observe(el));
}

function openGiftModal(giftName) {
  const modal = document.getElementById("giftModal");
  document.getElementById("giftModalGiftName").textContent = giftName;
  modal.dataset.giftName = giftName;
  modal.classList.add("open");
  document.getElementById("giftGuestName").focus();
}

function closeGiftModal() {
  document.getElementById("giftModal").classList.remove("open");
  document.getElementById("giftForm").reset();
}

async function handleGiftSubmit(e) {
  e.preventDefault();
  const modal = document.getElementById("giftModal");
  const giftName = modal.dataset.giftName;
  const guestName = document.getElementById("giftGuestName").value.trim();
  if (!guestName) return;

  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  if (usingSheetsBackend()) {
    try {
      // Content-Type text/plain evita o preflight OPTIONS, que o Apps Script não trata.
      const res = await fetch(SHEETS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "reserveGift", giftName, guestName }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Não foi possível reservar este presente.");
        submitBtn.disabled = false;
        return;
      }
    } catch (err) {
      alert("Erro de conexão. Tente novamente.");
      submitBtn.disabled = false;
      return;
    }
  } else {
    saveDemoReservation(giftName, guestName);
  }

  submitBtn.disabled = false;
  closeGiftModal();
  renderGifts();
}

document.addEventListener("DOMContentLoaded", () => {
  renderGifts();
  document.getElementById("giftModalClose").addEventListener("click", closeGiftModal);
  document.getElementById("giftForm").addEventListener("submit", handleGiftSubmit);
  document.getElementById("giftModal").addEventListener("click", (e) => {
    if (e.target.id === "giftModal") closeGiftModal();
  });
});
