import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildVkMessage,
  validateLead,
} from '../server/lead-handler.mjs';

test('validateLead trims values and accepts a valid lead', () => {
  const lead = validateLead({
    name: '  Анна  ',
    phone: '  8 912 000 00 00  ',
    source: 'modal',
  });

  assert.deepEqual(lead, {
    name: 'Анна',
    phone: '+7 (912) 000-00-00',
    source: 'modal',
  });
});

test('validateLead rejects an empty name', () => {
  assert.throws(
    () => validateLead({ name: '   ', phone: '+7 (912) 000-00-00', source: 'hero' }),
    /name/i,
  );
});

test('validateLead rejects an empty phone', () => {
  assert.throws(
    () => validateLead({ name: 'Анна', phone: '   ', source: 'hero' }),
    /phone/i,
  );
});

test('validateLead rejects a non-russian phone number', () => {
  assert.throws(
    () => validateLead({ name: 'Анна', phone: '7993452345234523454352345', source: 'hero' }),
    /valid ru phone/i,
  );
});

test('buildVkMessage formats a readable admin notification', () => {
  const text = buildVkMessage({
    name: 'Анна',
    phone: '+7 (912) 000-00-00',
    source: 'modal',
    createdAt: '2026-03-31T01:23:45.000Z',
  });

  assert.match(text, /Новая заявка/i);
  assert.match(text, /Анна/);
  assert.match(text, /\+7 \(912\) 000-00-00/);
  assert.match(text, /Источник: сайт/);
  assert.match(text, /31 марта 2026 года 04:23/);
});
