import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(html, /src="src\/vk\.png"/, 'Expected the VK asset from src to be used.');
assert.match(html, /src="src\/inst\.webp"/, 'Expected the Instagram asset from src to be used.');
assert.match(
  html,
  /href="https:\/\/vk\.com\/tonusclubperm" class="social-btn social-vk"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/,
  'Expected the VK social link to open as an external target.',
);
assert.match(
  html,
  /href="https:\/\/www\.instagram\.com\/tonus_club_perm\/" class="social-btn social-inst"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/,
  'Expected the Instagram social link to open as an external target.',
);
assert.ok(!html.includes('social-ok'), 'Odnoklassniki markup should be removed.');
assert.match(html, /@media\s*\(max-width:\s*960px\)/, 'Expected a mobile breakpoint for the layout.');
assert.match(html, /class="mobile-menu-toggle"/, 'Expected a dedicated mobile menu toggle button.');
assert.match(html, /html\s*\{[\s\S]*scroll-padding-top:\s*\d+px;/, 'Expected global anchor scroll padding so sticky header no longer overlaps anchor targets.');
assert.match(html, /section\[id\]\s*\{[\s\S]*scroll-margin-top:\s*\d+px;/, 'Expected anchor sections to compensate for the sticky header height.');
assert.match(html, /\.logo\s*\{[\s\S]*overflow:\s*hidden;/, 'Expected the logo wrapper to crop the dark image background.');
assert.match(html, />Клуб в Перми</, 'Expected the header navigation to use the singular club label.');
assert.ok(!html.includes('Клубы в Перми'), 'The old plural club label should be removed.');
assert.ok(!html.includes('Адреса клубов'), 'The old plural footer club label should be removed.');
assert.match(html, /<section id="clubs">[\s\S]*Наш <span>клуб<\/span>/, 'Expected the club navigation anchor to lead to the "Наш клуб" section.');
assert.ok(!html.includes('<section id="clubs">\n  <h2 class="section-title">Успех <span>в цифрах</span></h2>'), 'The stats block should no longer be the section targeted by the club anchor.');
assert.ok(!html.includes(".social-btn {\n    width: 38px;\n    height: 38px;\n    border-radius: 12px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    text-decoration: none;\n    transition: transform .2s, border-color .2s, background .2s;\n    border: 1px solid rgba(0,0,0,.08);"), 'The social buttons should no longer use an outer border.');
assert.ok(!html.includes("background: #fffaf1;\n    border: 1px solid rgba(245,160,0,.24);"), 'The phone link should no longer use the old outlined pill style.');
assert.match(html, /body\s*\{[^}]*font-family:\s*'Montserrat',\s*sans-serif;/, 'Expected Montserrat to be the base font for the page.');
assert.ok(!html.includes("family=Roboto"), 'The old Roboto font import should be removed.');
assert.match(html, /\.hero\s*\{[^}]*max-width:\s*[^;]+;/, 'Expected the hero layout to have a constrained max-width.');
assert.match(html, /\.hero\s*\{[^}]*margin:\s*[^;]*auto/, 'Expected the hero block to be centered instead of stretching edge-to-edge.');
assert.match(html, /\.hero-title\s*\{[\s\S]*font-weight:\s*800;/, 'Expected the main hero title to use a slightly lighter weight.');
assert.match(html, /\.hero-title\s*\{[\s\S]*font-size:\s*clamp\(42px,\s*4\.4vw,\s*64px\);/, 'Expected the main hero title to be slightly smaller than before.');
assert.match(html, /class="stat-kicker"/, 'Expected the stats section to use richer card metadata.');
assert.ok(!html.includes('clip-path: polygon(0 0, calc(100% - 56px) 0, 100% 56px, 100% 100%, 0 100%)'), 'The stats cards should no longer use the cut corner clip-path.');
assert.match(html, /\.stat-item:hover\s*\{/, 'Expected a hover animation for the stats cards.');
assert.ok(!html.includes('В среднем теряют наши клиенты каждую неделю'), 'The weak weight-loss claim should be removed from the stats block.');
assert.ok(!html.includes('В талии за одно занятие на умных тренажёрах'), 'The weak circumference claim should be removed from the stats block.');
assert.match(html, /203-03-90/, 'Expected the header phone number to be present.');
assert.match(html, /href="tel:\+73422030390"/, 'Expected a direct tel link instead of a call button.');
assert.ok(!html.includes('270 р.'), 'The old trial price should be removed.');
assert.match(html, /350 р\./, 'Expected the new trial price to be present.');
assert.match(html, /-65%/, 'Expected the updated 65% discount to be present.');
assert.ok(!html.includes('-85%'), 'The old 85% discount marker should be removed.');
assert.ok(!html.includes('скидкой 85%'), 'The old 85% discount copy should be removed.');
assert.match(html, /@media\s*\(max-width:\s*960px\)[\s\S]*\.hero-right\s*\{[\s\S]*display:\s*none;/, 'Expected the separate hero image block to be hidden on mobile.');
assert.match(html, /src\/greenplaza\.jpg/, 'Expected the club block to use the Green Plaza image from src.');
assert.match(html, /ул\. Куйбышева 95Б БЦ/, 'Expected the street portion of the Green Plaza address overlay.');
assert.match(html, /Green Plaza, 5 этаж/, 'Expected the highlighted Green Plaza floor information.');
assert.match(html, /class="club-showcase-accent"/, 'Expected the Green Plaza address fragment to have a dedicated accent style.');
assert.match(html, /1677867164\/reviews/, 'Expected the reviews CTA to link directly to the Yandex reviews page.');
assert.match(html, /src="src\/katya\.webp"/, 'Expected Katya review to use the local photo asset.');
assert.match(html, /src="src\/marina\.webp"/, 'Expected Marina review to use the local photo asset.');
assert.match(html, /src="src\/lena\.webp"/, 'Expected Lena review to use the local photo asset.');
assert.ok(!html.includes('>АН</div>'), 'The old initials-based avatar for the first review should be removed.');
assert.ok(!html.includes('>МА</div>'), 'The old initials-based avatar for the second review should be removed.');
assert.ok(!html.includes('>ЕК</div>'), 'The old initials-based avatar for the third review should be removed.');
assert.match(html, /pt=56\.247158,57\.990810/, 'Expected the map widget to include a visible placemark for the club.');
assert.match(html, /\.map-wrap\s*\{[\s\S]*position:\s*relative;/, 'Expected the map section to use a layered composition container.');
assert.match(html, /\.map-wrap\s*\{[\s\S]*overflow:\s*hidden;/, 'Expected the map section to clip the background map cleanly.');
assert.match(html, /\.map-wrap\s*\{[\s\S]*width:\s*100%;/, 'Expected the map section to stretch to the full available width.');
assert.ok(!html.includes('max-width: 1320px;'), 'The map should no longer be constrained by the old centered max-width.');
assert.match(html, /\.map-list\s*\{[\s\S]*position:\s*absolute;/, 'Expected the location list to float above the map instead of sitting in a rigid column.');
assert.match(html, /\.map-list\s*\{[\s\S]*height:\s*calc\(100%\s*-\s*72px\);/, 'Expected the floating contact card to stretch through the full available map height on desktop.');
assert.match(html, /\.map-placeholder\s*\{[\s\S]*position:\s*absolute;/, 'Expected the map itself to fill the whole section background.');
assert.match(html, /\.map-placeholder iframe\s*\{[\s\S]*pointer-events:\s*none;/, 'Expected the embedded map to be non-interactive so the zoom cannot be changed.');
assert.match(html, /class="map-control-mask map-control-mask-left"/, 'Expected a left-side control mask to hide extra map tools.');
assert.match(html, /class="map-control-mask map-control-mask-bottom"/, 'Expected a bottom control mask to hide extra map tools.');
assert.match(html, /class="map-control-mask map-control-mask-top-right"/, 'Expected a top-right control mask to hide extra map tools.');
assert.match(html, /z=15\.4/, 'Expected the map zoom to be slightly more distant than the old close-up view.');
assert.match(html, /id="footerYear"/, 'Expected a dedicated footer year placeholder.');
assert.match(html, /new Date\(\)\.getFullYear\(\)/, 'Expected the footer year to be generated dynamically from the current year.');
assert.ok(!html.includes('© 2012 «Тонус-клуб»'), 'The footer should no longer hardcode the old year.');

console.log('Header/mobile source checks passed.');
