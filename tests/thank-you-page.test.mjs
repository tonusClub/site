import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const thankYou = readFileSync(new URL('../spasibo.html', import.meta.url), 'utf8');

assert.match(thankYou, /<title>Спасибо/, 'Expected a dedicated thank-you page title.');
assert.match(thankYou, /<meta name="robots" content="noindex, nofollow">/, 'Expected the thank-you page to stay out of search indexes.');
assert.match(thankYou, /Спасибо! Заявка отправлена\./, 'Expected the thank-you page to confirm a successful lead submission.');
assert.match(thankYou, /<a href="\/"[^>]*>Вернуться на главную<\/a>/, 'Expected the thank-you page to offer a route back to the landing page.');
assert.match(thankYou, /<!--YANDEX_METRIKA_HEAD-->/, 'Expected the thank-you page to expose a marker for Metrika script injection.');
assert.match(thankYou, /<!--YANDEX_METRIKA_GOAL-->/, 'Expected the thank-you page to expose a marker for the thank-you goal trigger.');

console.log('Thank-you page checks passed.');
