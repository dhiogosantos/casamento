/**
 * Apps Script que transforma a Planilha Google em "backend" do site.
 * Como instalar: veja o passo a passo em README.md.
 *
 * Espera duas abas na planilha, com estes cabeçalhos exatos na linha 1:
 *
 * Aba "Confirmacoes":
 *   DataEnvio | Nome | Whatsapp | Email | Vai | Acompanhantes | Mensagem
 *
 * Aba "Presentes":
 *   Nome | Descricao | Preco | Imagem | Status | DadoPor | Data
 *   (Imagem é opcional; Status vazio ou "Disponível" = ainda não dado)
 */

function doGet(e) {
  try {
    if (e.parameter.action === "getGifts") {
      return jsonResponse({ success: true, gifts: getGiftsData() });
    }
    return jsonResponse({ success: false, message: "Ação inválida." });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.action === "addRsvp") {
      addRsvp(data);
      return jsonResponse({ success: true });
    }

    if (data.action === "reserveGift") {
      return jsonResponse(reserveGift(data));
    }

    return jsonResponse({ success: false, message: "Ação inválida." });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function getGiftsData() {
  var sheet = getSheet("Presentes");
  var rows = sheet.getDataRange().getValues();
  var headers = rows.shift().map(function (h) {
    return String(h).trim();
  });

  return rows
    .filter(function (r) {
      return r[0];
    })
    .map(function (r) {
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h] = r[i];
      });
      return obj;
    });
}

function addRsvp(data) {
  getSheet("Confirmacoes").appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.attending || "",
    data.guests || "",
    data.message || "",
  ]);
}

function reserveGift(data) {
  var sheet = getSheet("Presentes");
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0].map(function (h) {
    return String(h).trim();
  });

  var nameCol = headers.indexOf("Nome");
  var statusCol = headers.indexOf("Status");
  var givenByCol = headers.indexOf("DadoPor");
  var dateCol = headers.indexOf("Data");

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][nameCol]).trim() === String(data.giftName).trim()) {
      var currentStatus = String(rows[i][statusCol] || "").trim().toLowerCase();
      var alreadyTaken = currentStatus && currentStatus !== "disponível" && currentStatus !== "disponivel";

      if (alreadyTaken) {
        return { success: false, message: "Esse presente já foi escolhido por outra pessoa." };
      }

      sheet.getRange(i + 1, statusCol + 1).setValue("Reservado");
      sheet.getRange(i + 1, givenByCol + 1).setValue(data.guestName);
      sheet.getRange(i + 1, dateCol + 1).setValue(new Date());
      return { success: true };
    }
  }

  return { success: false, message: "Presente não encontrado na planilha." };
}
