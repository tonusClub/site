function asTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const RU_MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function normalizeRuPhone(value) {
  const digits = asTrimmedString(value).replace(/\D/g, '');

  if (!digits) {
    throw new Error('phone is required');
  }

  let localDigits = '';
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    localDigits = digits.slice(1);
  } else if (digits.length === 10) {
    localDigits = digits;
  } else {
    throw new Error('phone must be a valid RU phone number');
  }

  return `+7 (${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6, 8)}-${localDigits.slice(8, 10)}`;
}

export function formatLeadDate(isoString) {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(part => [part.type, part.value]),
  );

  const day = Number(parts.day);
  const monthIndex = Number(parts.month) - 1;
  const year = parts.year;
  const hour = pad2(parts.hour);
  const minute = pad2(parts.minute);

  return `${day} ${RU_MONTHS[monthIndex]} ${year} года ${hour}:${minute}`;
}

export function validateLead(input) {
  const name = asTrimmedString(input?.name);
  const source = asTrimmedString(input?.source) || 'unknown';

  if (!name) {
    throw new Error('name is required');
  }

  const phone = normalizeRuPhone(input?.phone);

  return { name, phone, source };
}

export function buildVkMessage({ name, phone, source, createdAt }) {
  return [
    'Новая заявка с сайта',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    'Источник: сайт',
    `Дата: ${formatLeadDate(createdAt)}`,
  ].join('\n');
}
