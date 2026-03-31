function makeRandomId() {
  return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

export function createVkMessageSender({
  token,
  peerId,
  apiVersion = '5.199',
  fetchImpl = fetch,
}) {
  if (!token) {
    throw new Error('VK token is required');
  }

  if (!peerId) {
    throw new Error('VK peer id is required');
  }

  return async function sendVkMessage(message) {
    const body = new URLSearchParams({
      access_token: token,
      peer_id: String(peerId),
      random_id: makeRandomId(),
      message,
      v: apiVersion,
    });

    const response = await fetchImpl('https://api.vk.com/method/messages.send', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body,
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(`VK HTTP error: ${response.status}`);
    }

    if (payload?.error?.error_msg) {
      throw new Error(payload.error.error_msg);
    }

    return payload.response;
  };
}
