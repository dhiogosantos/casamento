/* =========================================================
   Confirmação de Presença (RSVP)
   Fonte de verdade: aba "Confirmacoes" da Planilha Google
   (configurada em js/config.js). Sem SHEETS_API_URL, cai em
   modo demonstração local (localStorage), só para testar o
   formulário antes do setup.
   ========================================================= */

const RSVP_DEMO_STORAGE_KEY = "wedding_rsvp_demo";

function saveRsvpLocally(data) {
  const list = JSON.parse(localStorage.getItem(RSVP_DEMO_STORAGE_KEY)) || [];
  list.push({ ...data, submittedAt: new Date().toISOString() });
  localStorage.setItem(RSVP_DEMO_STORAGE_KEY, JSON.stringify(list));
}

function showRsvpSuccess(data, form) {
  const successMessage = document.getElementById("rsvpSuccessMessage");
  successMessage.textContent =
    "Sua presença foi confirmada com alegria. Mal podemos esperar para celebrar com você!";
  form.style.display = "none";
  document.getElementById("rsvpSuccess").classList.add("show");
}

async function handleRsvpSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  if (SHEETS_API_URL) {
    try {
      // Content-Type text/plain evita o preflight OPTIONS, que o Apps Script não trata.
      const res = await fetch(SHEETS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "addRsvp", ...data }),
      });
      const result = await res.json();
      if (!result.success) {
        alert("Não foi possível enviar sua confirmação. Tente novamente.");
        submitBtn.disabled = false;
        return;
      }
    } catch (err) {
      alert("Erro de conexão. Tente novamente.");
      submitBtn.disabled = false;
      return;
    }
  } else {
    saveRsvpLocally(data);
  }

  showRsvpSuccess(data, form);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvpForm");
  if (form) form.addEventListener("submit", handleRsvpSubmit);
});
