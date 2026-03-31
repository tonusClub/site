import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { createServer } from 'node:http';

import { createRequestHandler } from '../server/http-server.mjs';

function makeTempSite() {
  const rootDir = mkdtempSync(join(tmpdir(), 'tonus-site-'));
  mkdirSync(join(rootDir, 'src'));
  writeFileSync(join(rootDir, 'index.html'), '<!doctype html><h1>hello</h1>');
  writeFileSync(join(rootDir, 'consent.html'), '<!doctype html><h1>consent</h1>');
  writeFileSync(
    join(rootDir, 'spasibo.html'),
    '<!doctype html><head><!--YANDEX_METRIKA_HEAD--></head><body><h1>thanks</h1><!--YANDEX_METRIKA_GOAL--></body>',
  );
  writeFileSync(join(rootDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://тонус-клуб.рф/sitemap.xml\n');
  writeFileSync(
    join(rootDir, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://тонус-клуб.рф/</loc></url></urlset>',
  );
  writeFileSync(join(rootDir, 'src', 'app.txt'), 'asset');
  return rootDir;
}

function sendRequest(server, options, body) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const req = httpRequest(
      {
        hostname: '127.0.0.1',
        port: address.port,
        ...options,
      },
      res => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
      },
    );

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

test('createRequestHandler serves the landing page and forwards leads to VK', async () => {
  const sent = [];
  const rootDir = makeTempSite();
  const server = createServer(
    createRequestHandler({
      rootDir,
      metrikaCounterId: '12345678',
      sendVkMessage: async message => {
        sent.push(message);
      },
    }),
  );

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

  try {
    const home = await sendRequest(server, { method: 'GET', path: '/' });
    assert.equal(home.statusCode, 200);
    assert.match(home.body, /hello/);

    const consent = await sendRequest(server, { method: 'GET', path: '/consent' });
    assert.equal(consent.statusCode, 200);
    assert.match(consent.body, /consent/);

    const thankYou = await sendRequest(server, { method: 'GET', path: '/spasibo' });
    assert.equal(thankYou.statusCode, 200);
    assert.match(thankYou.body, /thanks/);
    assert.match(thankYou.body, /mc\.yandex\.ru\/metrika\/tag\.js/);
    assert.match(thankYou.body, /watch\/12345678/);
    assert.match(thankYou.body, /reachGoal', 'spasibo'/);

    const robots = await sendRequest(server, { method: 'GET', path: '/robots.txt' });
    assert.equal(robots.statusCode, 200);
    assert.match(robots.headers['content-type'], /^text\/plain/);
    assert.match(robots.body, /Sitemap: https:\/\/тонус-клуб\.рф\/sitemap\.xml/);

    const sitemap = await sendRequest(server, { method: 'GET', path: '/sitemap.xml' });
    assert.equal(sitemap.statusCode, 200);
    assert.match(sitemap.headers['content-type'], /^application\/xml/);
    assert.match(sitemap.body, /<urlset/);

    const api = await sendRequest(
      server,
      {
        method: 'POST',
        path: '/api/lead',
        headers: { 'content-type': 'application/json' },
      },
      JSON.stringify({ name: 'Анна', phone: '+7 (912) 000-00-00', source: 'cta' }),
    );

    assert.equal(api.statusCode, 200);
    assert.deepEqual(JSON.parse(api.body), { ok: true });
    assert.equal(sent.length, 1);
    assert.match(sent[0], /Анна/);
  } finally {
    await new Promise((resolve, reject) => server.close(error => (error ? reject(error) : resolve())));
  }
});
