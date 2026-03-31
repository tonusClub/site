import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

import { handleLeadApiRequest } from './app.mjs';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

const YANDEX_METRIKA_HEAD_MARKER = '<!--YANDEX_METRIKA_HEAD-->';
const YANDEX_METRIKA_GOAL_MARKER = '<!--YANDEX_METRIKA_GOAL-->';

function getContentType(filePath) {
  return MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function normalizeMetrikaCounterId(counterId) {
  const trimmed = String(counterId || '').trim();
  return /^\d+$/.test(trimmed) ? trimmed : '';
}

function getMetrikaHeadSnippet(counterId) {
  return `<script type="text/javascript">
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  ym(${counterId}, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
  });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${counterId}" style="position:absolute; left:-9999px;" alt=""></div></noscript>`;
}

function getMetrikaGoalSnippet(counterId) {
  return `<script>
  if (typeof window.ym === 'function') {
    window.ym(${counterId}, 'reachGoal', 'spasibo');
  }
</script>`;
}

function injectMetrika(html, counterId) {
  const normalizedCounterId = normalizeMetrikaCounterId(counterId);
  const headSnippet = normalizedCounterId ? getMetrikaHeadSnippet(normalizedCounterId) : '';
  const goalSnippet = normalizedCounterId ? getMetrikaGoalSnippet(normalizedCounterId) : '';

  return html
    .replaceAll(YANDEX_METRIKA_HEAD_MARKER, headSnippet)
    .replaceAll(YANDEX_METRIKA_GOAL_MARKER, goalSnippet);
}

function resolvePublicPath(rootDir, pathname) {
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const candidates = [safePath];

  if (!extname(safePath)) {
    candidates.push(`${safePath}.html`);
  }

  for (const candidate of candidates) {
    const relativePath = normalize(candidate).replace(/^(\.\.[/\\])+/, '');
    const absolutePath = resolve(join(rootDir, relativePath));

    if (!absolutePath.startsWith(resolve(rootDir))) {
      continue;
    }

    if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
      return absolutePath;
    }
  }

  return null;
}

async function readIncomingBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function writeWebResponse(res, webResponse) {
  res.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.end(await webResponse.text());
}

export function createRequestHandler({ rootDir, sendVkMessage, metrikaCounterId }) {
  return async function requestHandler(req, res) {
    const url = new URL(req.url || '/', 'http://127.0.0.1');

    if (url.pathname === '/api/lead') {
      const body = await readIncomingBody(req);
      const request = new Request(`http://127.0.0.1${url.pathname}`, {
        method: req.method,
        headers: req.headers,
        body: body || undefined,
      });
      const response = await handleLeadApiRequest(request, { sendVkMessage });
      await writeWebResponse(res, response);
      return;
    }

    if (!['GET', 'HEAD'].includes(req.method || 'GET')) {
      res.statusCode = 405;
      res.end('Method Not Allowed');
      return;
    }

    const filePath = resolvePublicPath(rootDir, url.pathname);
    if (!filePath) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    res.statusCode = 200;
    res.setHeader('content-type', getContentType(filePath));

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    if (extname(filePath).toLowerCase() === '.html') {
      const html = await readFile(filePath, 'utf8');
      res.end(injectMetrika(html, metrikaCounterId));
      return;
    }

    createReadStream(filePath).pipe(res);
  };
}
