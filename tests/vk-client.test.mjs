import assert from 'node:assert/strict';
import test from 'node:test';

import { createVkMessageSender } from '../server/vk.mjs';

test('createVkMessageSender posts the message to VK API', async () => {
  const calls = [];
  const sendVkMessage = createVkMessageSender({
    token: 'secret-token',
    peerId: '12345',
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify({ response: 1 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    },
  });

  await sendVkMessage('Тест');

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.vk.com/method/messages.send');
  assert.equal(calls[0].options.method, 'POST');

  const body = calls[0].options.body;
  assert.equal(body.get('access_token'), 'secret-token');
  assert.equal(body.get('peer_id'), '12345');
  assert.equal(body.get('message'), 'Тест');
  assert.ok(body.get('random_id'));
  assert.ok(body.get('v'));
});

test('createVkMessageSender throws when VK returns an API error', async () => {
  const sendVkMessage = createVkMessageSender({
    token: 'secret-token',
    peerId: '12345',
    fetchImpl: async () =>
      new Response(JSON.stringify({
        error: { error_msg: 'Access denied' },
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  });

  await assert.rejects(() => sendVkMessage('Тест'), /Access denied/);
});
