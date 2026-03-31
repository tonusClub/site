import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const consent = readFileSync(new URL('../consent.html', import.meta.url), 'utf8');

assert.match(consent, /<title>Согласие на обработку персональных данных/, 'Expected a dedicated consent page title.');
assert.match(consent, /Согласие на использование персональнных данных/, 'Expected the provided consent heading to be present.');
assert.match(consent, /1\.1\.[\s\S]*https:\/\/tonus64\.ru\//, 'Expected the original source site reference to remain in the consent text.');
assert.match(consent, /ИП Поципко Ю\.О\./, 'Expected the operator reference from the provided legal text.');
assert.match(consent, /tonussar1@mail\.ru/, 'Expected the withdrawal email to be present.');
assert.match(consent, /<a href="index\.html"[^>]*>На главную<\/a>/, 'Expected a way back to the main page.');

console.log('Consent page checks passed.');
