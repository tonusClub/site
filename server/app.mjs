import { buildVkMessage, validateLead } from './lead-handler.mjs';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new Error('invalid json');
  }
}

export async function handleLeadApiRequest(request, { sendVkMessage }) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method not allowed' }, 405);
  }

  let payload;
  try {
    payload = await readJson(request);
  } catch (error) {
    return json({ ok: false, error: error.message }, 400);
  }

  let lead;
  try {
    lead = validateLead(payload);
  } catch (error) {
    return json({ ok: false, error: error.message }, 400);
  }

  const message = buildVkMessage({
    ...lead,
    createdAt: new Date().toISOString(),
  });

  try {
    await sendVkMessage(message, lead);
  } catch (error) {
    return json({ ok: false, error: error.message || 'VK delivery failed' }, 502);
  }

  return json({ ok: true });
}
