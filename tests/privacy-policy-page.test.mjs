import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const policy = readFileSync(new URL('../privacy-policy.html', import.meta.url), 'utf8');

assert.match(policy, /<title>Политика конфиденциальности/, 'Expected a dedicated privacy policy page title.');
assert.match(policy, /Политика конфиденциальности/, 'Expected the provided privacy policy heading to be present.');
assert.match(policy, /https:\/\/тонус-клуб\.рф/, 'Expected the privacy policy text to use the current production domain.');
assert.ok(!policy.includes('https://tonus64.ru'), 'The old source domain should be replaced in the policy page.');
assert.match(policy, /Индивидуальный предприниматель Поципко Юлия Олеговна/, 'Expected the operator details from the provided policy text.');
assert.match(policy, /ИНН 645310851281/, 'Expected the operator INN to be present in the policy text.');
assert.match(policy, /<a href="\/"[^>]*>На главную<\/a>/, 'Expected a way back to the main page.');

console.log('Privacy policy page checks passed.');
