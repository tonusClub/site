import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { createRequestHandler } from './http-server.mjs';
import { createVkMessageSender } from './vk.mjs';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, '..');

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const sendVkMessage = createVkMessageSender({
  token: process.env.VK_TOKEN,
  peerId: process.env.VK_PEER_ID,
  apiVersion: process.env.VK_API_VERSION || '5.199',
});

const server = createServer(
  createRequestHandler({
    rootDir,
    sendVkMessage,
    metrikaCounterId: process.env.YANDEX_METRIKA_ID,
  }),
);

server.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
