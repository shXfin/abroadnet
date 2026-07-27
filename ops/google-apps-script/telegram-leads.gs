const SHEET_NAME = "Leads";
const DEFAULT_SPREADSHEET_ID = "10KlI1SjOTcnN6VJejkPlRXQ5j69mf8byEq0WItM8Zbk";

const HEADERS = [
  "timestamp",
  "formType",
  "source",
  "language",
  "name",
  "email",
  "phone",
  "normalizedPhone",
  "destination",
  "destinationOther",
  "level",
  "field",
  "fieldOther",
  "budget",
  "english",
  "academic",
  "intake",
  "notes",
];

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || "{}");
    const sheet = getLeadSheet_();
    ensureHeaders_(sheet);

    const normalizedPhone = normalizePhone_(payload.phone);
    const email = String(payload.email || "").trim().toLowerCase();

    if (!payload.name || !email || !normalizedPhone) {
      return json_({ ok: false, status: "invalid" });
    }

    if (isDuplicate_(sheet, normalizedPhone, email)) {
      return json_({ ok: true, status: "duplicate" });
    }

    sheet.appendRow([
      new Date(),
      payload.formType || "",
      payload.source || "website-assessment",
      payload.language || "",
      payload.name || "",
      email,
      payload.phone || "",
      normalizedPhone,
      payload.destination || "",
      payload.destinationOther || "",
      payload.level || "",
      payload.field || "",
      payload.fieldOther || "",
      payload.budget || "",
      payload.english || "",
      payload.academic || "",
      payload.intake || "",
      payload.notes || "",
    ]);

    sendTelegram_(payload, normalizedPhone, email);
    return json_({ ok: true, status: "created" });
  } catch (error) {
    return json_({ ok: false, status: "error", message: String(error) });
  }
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    if (params.action !== "checkDuplicate") {
      return jsonpOrJson_(params.callback, { ok: false, status: "unknown" });
    }

    const sheet = getLeadSheet_();
    ensureHeaders_(sheet);

    const normalizedPhone = normalizePhone_(params.phone);
    const email = String(params.email || "").trim().toLowerCase();

    if (!email && !normalizedPhone) {
      return jsonpOrJson_(params.callback, { ok: false, status: "invalid" });
    }

    return jsonpOrJson_(params.callback, {
      ok: true,
      status: isDuplicate_(sheet, normalizedPhone, email) ? "duplicate" : "unique",
    });
  } catch (error) {
    return jsonpOrJson_((e && e.parameter && e.parameter.callback) || "", {
      ok: false,
      status: "error",
      message: String(error),
    });
  }
}

function getLeadSheet_() {
  const spreadsheet = getSpreadsheet_();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
  return SpreadsheetApp.openById(spreadsheetId);
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some(Boolean);
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function isDuplicate_(sheet, normalizedPhone, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return rows.some((row) => {
    const rowEmail = String(row[4] || "").trim().toLowerCase();
    const rowPhone = String(row[6] || "").trim();
    return rowPhone === normalizedPhone || rowEmail === email;
  });
}

function normalizePhone_(phone) {
  let digits = String(phone || "").replace(/[^\d]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "880" + digits.slice(1);
  if (digits.length === 10 && digits.startsWith("1")) digits = "880" + digits;
  return digits;
}

function sendTelegram_(payload, normalizedPhone, email) {
  const props = PropertiesService.getScriptProperties();
  const botToken = props.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = props.getProperty("TELEGRAM_CHAT_ID");

  if (!botToken || !chatId) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID script property.");
  }

  const message = [
    "New Abroad Net Assessment",
    "",
    "Name: " + clean_(payload.name),
    "Phone: " + clean_(payload.phone) + " (" + normalizedPhone + ")",
    "Email: " + clean_(email),
    "Destination: " + clean_(payload.destination),
    "Other country: " + clean_(payload.destinationOther),
    "Degree: " + clean_(payload.level),
    "Field: " + clean_(payload.field),
    "Other course: " + clean_(payload.fieldOther),
    "Budget: " + clean_(payload.budget),
    "English: " + clean_(payload.english),
    "Academic: " + clean_(payload.academic),
    "Intake: " + clean_(payload.intake),
    "Notes: " + clean_(payload.notes),
    "",
    "Source: " + clean_(payload.source || "website-assessment"),
  ].join("\n");

  UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
    muteHttpExceptions: true,
  });
}

function clean_(value) {
  return String(value || "-").trim();
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function jsonpOrJson_(callback, payload) {
  const safeCallback = String(callback || "").trim();
  if (/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(safeCallback)) {
    return ContentService
      .createTextOutput(safeCallback + "(" + JSON.stringify(payload) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(payload);
}
