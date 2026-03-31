import assert from 'node:assert/strict';
import test from 'node:test';

import { handleLeadApiRequest } from '../server/app.mjs';

test('handleLeadApiRequest rejects non-POST methods', async () => {
  const response = await handleLeadApiRequest(
    new Request('http://localhost/api/lead', { method: 'GET' }),
    { sendVkMessage: async () => {} },
  );

  assert.equal(response.status, 405);
});

test('handleLeadApiRequest validates the payload', async () => {
  const response = await handleLeadApiRequest(
    new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '', phone: '' }),
    }),
    { sendVkMessage: async () => {} },
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'name is required',
  });
});

test('handleLeadApiRequest rejects an invalid RU phone number', async () => {
  const response = await handleLeadApiRequest(
    new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Анна', phone: '123', source: 'cta' }),
    }),
    { sendVkMessage: async () => {} },
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'phone must be a valid RU phone number',
  });
});

test('handleLeadApiRequest sends a formatted VK message for a valid lead', async () => {
  const sent = [];
  const response = await handleLeadApiRequest(
    new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Анна',
        phone: '+7 (912) 000-00-00',
        source: 'modal',
      }),
    }),
    {
      sendVkMessage: async message => {
        sent.push(message);
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(sent.length, 1);
  assert.match(sent[0], /Новая заявка с сайта/);
  assert.match(sent[0], /Анна/);
  assert.match(sent[0], /\+7 \(912\) 000-00-00/);
});

test('handleLeadApiRequest returns a 502 response when VK delivery fails', async () => {
  const response = await handleLeadApiRequest(
    new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Анна',
        phone: '+7 (912) 000-00-00',
        source: 'modal',
      }),
    }),
    {
      sendVkMessage: async () => {
        throw new Error('Access denied');
      },
    },
  );

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'Access denied',
  });
});
