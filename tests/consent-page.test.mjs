import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const consent = readFileSync(new URL('../consent.html', import.meta.url), 'utf8');

assert.match(consent, /<title>Согласие на обработку персональных данных/, 'Expected a dedicated consent page title.');
assert.match(consent, /Согласие на использование персональнных данных/, 'Expected the provided consent heading to be present.');
assert.match(consent, /1\.1\.[\s\S]*https:\/\/тонус-клуб\.рф/, 'Expected the consent text to reference the current production site.');
assert.ok(!consent.includes('https://tonus64.ru'), 'The old source site should be removed from the consent page.');
assert.match(consent, /ИП Спешилов Сергей Юрьевич/, 'Expected the updated operator reference on the consent page.');
assert.match(consent, /tonussar1@mail\.ru/, 'Expected the withdrawal email to be present.');
assert.match(consent, /<a href="\/"[^>]*>На главную<\/a>/, 'Expected a way back to the main page.');

console.log('Consent page checks passed.');
