import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(html, /<form class="cta-form" id="ctaForm"/, 'Expected the promo CTA fields to be wrapped in a real form.');
assert.match(html, /<form class="modal-form" id="modalForm"/, 'Expected the modal fields to be wrapped in a real form.');
assert.match(html, /data-source="cta"/, 'Expected the promo form to include its lead source.');
assert.match(html, /data-source="modal"/, 'Expected the modal form to include its lead source.');
assert.match(html, /name="phone"[^>]*data-phone-input/, 'Expected phone inputs to be explicitly marked for a mask.');
assert.match(html, /fetch\('\/api\/lead'/, 'Expected form submission to call the backend lead endpoint.');
assert.match(html, /function submitLeadForm\(/, 'Expected a dedicated submit handler for the lead forms.');
assert.match(html, /function formatPhoneInput\(/, 'Expected a dedicated phone formatting function.');
assert.match(html, /function attachPhoneMask\(/, 'Expected phone inputs to opt into a reusable mask handler.');
assert.match(html, /const thankYouPath = '\/spasibo';/, 'Expected successful form submissions to use a dedicated thank-you page.');
assert.match(html, /window\.location\.assign\(thankYouPath\);/, 'Expected successful form submissions to redirect to the thank-you page.');
assert.ok(!html.includes("alert('Спасибо! Мы свяжемся с вами в ближайшее время 😊')"), 'The fake success alert should be removed in favor of real submission handling.');

console.log('Lead form wiring checks passed.');
