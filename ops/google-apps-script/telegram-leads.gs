const SHEET_NAME = "Leads";
const FEEDBACK_SHEET_NAME = "Feedback";
const DEFAULT_SPREADSHEET_ID = "10KlI1SjOTcnN6VJejkPlRXQ5j69mf8byEq0WItM8Zbk";

const HEADERS = [
  "timestamp",
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
  "callDone",
];

// Staff ticks TRUE in this column (or types TRUE/yes) once a student's 1:1
// consultation call is finished, unlocking the review form for them.
const CALL_DONE_COL = HEADERS.indexOf("callDone");

const FEEDBACK_HEADERS = [
  "timestamp",
  "name",
  "email",
  "phone",
  "rating",
  "comment",
  "consentToShow",
  "approved",
];

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || "{}");

    if (payload.action === "submitReview") {
      return json_(submitReview_(payload));
    }

    const sheet = getLeadSheet_();
    ensureHeaders_(sheet, HEADERS);

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
      "",
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

    if (params.action === "checkReviewStatus") {
      return jsonpOrJson_(params.callback, checkReviewStatus_(params));
    }

    if (params.action === "getApprovedReviews") {
      return jsonpOrJson_(params.callback, getApprovedReviews_());
    }

    if (params.action !== "checkDuplicate") {
      return jsonpOrJson_(params.callback, { ok: false, status: "unknown" });
    }

    const sheet = getLeadSheet_();
    ensureHeaders_(sheet, HEADERS);

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

// Looks up a lead by email/phone and reports whether they're clear to leave
// a review: found at all, call marked done by staff, and not already reviewed.
function checkReviewStatus_(params) {
  const normalizedPhone = normalizePhone_(params.phone);
  const email = String(params.email || "").trim().toLowerCase();

  if (!email && !normalizedPhone) {
    return { ok: false, status: "invalid" };
  }

  const sheet = getLeadSheet_();
  ensureHeaders_(sheet, HEADERS);
  const lead = findLeadRow_(sheet, normalizedPhone, email);

  if (!lead) {
    return { ok: true, status: "not_found" };
  }

  if (String(lead[CALL_DONE_COL] || "").trim().toUpperCase() !== "TRUE") {
    return { ok: true, status: "call_pending", name: lead[3] };
  }

  const feedbackSheet = getFeedbackSheet_();
  ensureHeaders_(feedbackSheet, FEEDBACK_HEADERS);
  if (findFeedbackRow_(feedbackSheet, normalizedPhone, email)) {
    return { ok: true, status: "already_reviewed", name: lead[3] };
  }

  return { ok: true, status: "eligible", name: lead[3] };
}

function submitReview_(payload) {
  const normalizedPhone = normalizePhone_(payload.phone);
  const email = String(payload.email || "").trim().toLowerCase();
  const rating = Number(payload.rating);

  if (!rating || rating < 1 || rating > 5) {
    return { ok: false, status: "invalid" };
  }

  const status = checkReviewStatus_({ email: email, phone: payload.phone });
  if (status.status !== "eligible") {
    return { ok: false, status: status.status };
  }

  const feedbackSheet = getFeedbackSheet_();
  ensureHeaders_(feedbackSheet, FEEDBACK_HEADERS);
  feedbackSheet.appendRow([
    new Date(),
    status.name || payload.name || "",
    email,
    payload.phone || "",
    rating,
    payload.comment || "",
    payload.consentToShow ? "TRUE" : "FALSE",
    "",
  ]);

  return { ok: true, status: "created" };
}

// Public-facing: only what's safe to show on the site, and only rows staff
// has ticked "approved" after reading them.
function getApprovedReviews_() {
  const sheet = getFeedbackSheet_();
  ensureHeaders_(sheet, FEEDBACK_HEADERS);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { ok: true, reviews: [] };

  const rows = sheet.getRange(2, 1, lastRow - 1, FEEDBACK_HEADERS.length).getValues();
  const reviews = rows
    .filter((row) => {
      const consent = String(row[6] || "").trim().toUpperCase() === "TRUE";
      const approved = String(row[7] || "").trim().toUpperCase() === "TRUE";
      return consent && approved;
    })
    .map((row) => ({
      name: row[1],
      rating: Number(row[4]) || 0,
      comment: row[5],
    }));

  return { ok: true, reviews: reviews };
}

function getLeadSheet_() {
  const spreadsheet = getSpreadsheet_();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function getFeedbackSheet_() {
  const spreadsheet = getSpreadsheet_();
  return spreadsheet.getSheetByName(FEEDBACK_SHEET_NAME) || spreadsheet.insertSheet(FEEDBACK_SHEET_NAME);
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
  return SpreadsheetApp.openById(spreadsheetId);
}

function ensureHeaders_(sheet, headers) {
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = firstRow.some(Boolean);
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function isDuplicate_(sheet, normalizedPhone, email) {
  return Boolean(findLeadRow_(sheet, normalizedPhone, email));
}

// Returns the matching lead row (array of cell values), or null.
function findLeadRow_(sheet, normalizedPhone, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  let match = null;
  rows.forEach((row) => {
    const rowEmail = String(row[4] || "").trim().toLowerCase();
    const rowPhone = String(row[6] || "").trim();
    if (rowPhone === normalizedPhone || rowEmail === email) match = row;
  });
  return match;
}

function findFeedbackRow_(sheet, normalizedPhone, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const rows = sheet.getRange(2, 1, lastRow - 1, FEEDBACK_HEADERS.length).getValues();
  return rows.find((row) => {
    const rowEmail = String(row[2] || "").trim().toLowerCase();
    const rowPhone = normalizePhone_(row[3]);
    return rowPhone === normalizedPhone || rowEmail === email;
  }) || null;
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
