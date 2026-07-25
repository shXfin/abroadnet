const STORAGE_KEY = "abroadnet-submitted-leads";

type Identity = {
  email: string;
  phone: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "880" + digits.slice(1);
  if (digits.length === 10 && digits.startsWith("1")) digits = "880" + digits;
  return digits;
}

function fingerprint(identity: Identity) {
  return `e:${normalizeEmail(identity.email)}|p:${normalizePhone(identity.phone)}`;
}

function readStored() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStored(values: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values.slice(-50)));
}

export function hasSubmitted(identity: Identity) {
  return readStored().includes(fingerprint(identity));
}

export function rememberSubmission(identity: Identity) {
  const key = fingerprint(identity);
  const values = readStored();
  if (!values.includes(key)) values.push(key);
  writeStored(values);
}

export function combineCountryCode(countryCode: string, phone: string) {
  const cleanCode = countryCode.replace(/[^\d+]/g, "").replace(/\s+/g, "");
  const cleanPhone = phone.replace(/[^\d]/g, "");

  if (!cleanPhone) return cleanCode;

  const codeDigits = cleanCode.replace(/[^\d]/g, "");
  const normalizedPhone = codeDigits === "880" && cleanPhone.startsWith("0") ? cleanPhone.slice(1) : cleanPhone;
  return `${cleanCode.startsWith("+") ? "" : "+"}${codeDigits}${normalizedPhone}`;
}
