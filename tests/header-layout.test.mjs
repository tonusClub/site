import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(html, /src="src\/vk\.png"/, 'Expected the VK asset from src to be used.');
assert.match(
  html,
  /href="https:\/\/vk\.com\/tonusclubperm" class="social-btn social-vk"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/,
  'Expected the VK social link to open as an external target.',
);
assert.ok(!html.includes('https://www.instagram.com/tonus_club_perm/'), 'Instagram links should be removed from the landing page.');
assert.ok(!html.includes('src="src/inst.webp"'), 'The Instagram icon asset should no longer be rendered.');
assert.ok(!html.includes('social-inst'), 'Instagram-specific social button styling should be removed.');
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
assert.match(html, /\.hero\s*\{[^}]*max-width:\s*948px;/, 'Expected the hero layout to have a compact max-width close to the square-plus-media composition.');
assert.match(html, /\.hero\s*\{[^}]*margin:\s*[^;]*auto/, 'Expected the hero block to be centered instead of stretching edge-to-edge.');
assert.match(html, /\.hero\s*\{[\s\S]*align-items:\s*stretch;/, 'Expected the hero columns to stretch to the same height.');
assert.match(html, /\.hero\s*\{[\s\S]*gap:\s*22px;/, 'Expected the hero blocks to keep a visible white gap between the square card and the media card.');
assert.match(html, /\.hero\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*530px\)\s+minmax\(0,\s*340px\);/, 'Expected the hero to use a square left block and a narrower vertical media block.');
assert.match(html, /\.hero-left\s*\{[\s\S]*aspect-ratio:\s*1\s*\/\s*1;/, 'Expected the left hero block to keep a square proportion.');
assert.match(html, /\.hero-right\s*\{[\s\S]*padding:\s*0;/, 'Expected the right hero block to lose the oversized white frame and behave like a clean media card.');
assert.match(html, /\.hero-right\s*\{[\s\S]*height:\s*100%;/, 'Expected the right hero block to match the full height of the left hero block.');
assert.match(html, /\.hero-right\s*\{[\s\S]*max-width:\s*340px;/, 'Expected the right hero block to stay narrow enough for a vertical video.');
assert.match(html, /\.hero-label\s*\{[\s\S]*box-shadow:\s*0 0 0 16px #fff;/, 'Expected the white hero label to visually merge into the page background.');
assert.match(html, /\.hero-label\s*\{[\s\S]*transform:\s*translateY\(-\d+px\);/, 'Expected the white hero label to rise above the green block edge.');
assert.match(html, /\.hero-title\s*\{[\s\S]*font-weight:\s*800;/, 'Expected the main hero title to use a slightly lighter weight.');
assert.match(html, /\.hero-title\s*\{[\s\S]*font-size:\s*clamp\(42px,\s*4\.4vw,\s*64px\);/, 'Expected the main hero title to be slightly smaller than before.');
assert.match(html, /class="hero-video"/, 'Expected the hero media block to use a dedicated video element.');
assert.match(html, /src="src\/hero-video\.mp4"/, 'Expected the hero video to use the optimized local MP4 asset.');
assert.match(html, /autoplay muted loop playsinline/, 'Expected the hero video to autoplay silently in-place.');
assert.match(html, /\.hero-video\s*\{[\s\S]*height:\s*100%;/, 'Expected the hero video to fill the height of its framed column.');
assert.match(html, /\.hero-img-placeholder\s*\{[\s\S]*border-radius:\s*34px;/, 'Expected the hero media card to keep the same rounded geometry as the square green block.');
assert.match(html, /class="about-collage"/, 'Expected the about section to use a collage wrapper instead of a single stock image.');
assert.match(html, /src="src\/4\.(?:jpeg|png)"/, 'Expected the about collage to include the first local club photo.');
assert.match(html, /src="src\/5\.(?:jpeg|HEIC|png)"/, 'Expected the about collage to include the second local club photo.');
assert.ok(!html.includes('https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80" alt="Тренировка в клубе"'), 'The old stock image in the about section should be removed.');
assert.match(html, /<img src="src\/tonusTable\.png" alt="Тонусные столы" id="eqImg">/, 'Expected the equipment section to use the local tonus table photo by default.');
assert.match(html, /title:\s*'Тонусные столы',[\s\S]*img:\s*'src\/tonusTable\.png'/, 'Expected the tonus tables tab data to use the local tonus table photo.');
assert.match(html, /title:\s*'Баротренажёр',[\s\S]*img:\s*'src\/bara\.WEBP'/, 'Expected the barotrainer tab data to use the local bara photo.');
assert.match(html, /title:\s*'Роликовый тренажёр',[\s\S]*img:\s*'src\/rolllerTable\.jpg'[\s\S]*objectFit:\s*'contain'[\s\S]*objectPosition:\s*'center top'[\s\S]*imageScale:\s*'0\.92'/, 'Expected the roller trainer tab data to use the converted local photo with contain fitting and a gentler top-focused crop.');
assert.match(html, /title:\s*'Лимфодренаж',[\s\S]*img:\s*'src\/limfomassage\.PNG'/, 'Expected the lymph drainage tab data to use the local lymph massage photo.');
assert.match(html, /title:\s*'Система термопохудения',[\s\S]*img:\s*'src\/systemofthermo\.jpg'/, 'Expected the thermo slimming tab data to use the local thermo system photo.');
assert.match(html, /\.equipment-content img\s*\{[\s\S]*object-position:\s*var\(--eq-object-position,\s*center center\);/, 'Expected equipment images to support per-tab object positioning.');
assert.match(html, /\.equipment-content img\s*\{[\s\S]*object-fit:\s*var\(--eq-object-fit,\s*cover\);/, 'Expected equipment images to support per-tab object fitting.');
assert.match(html, /\.equipment-content img\s*\{[\s\S]*transform:\s*scale\(var\(--eq-image-scale,\s*1\)\);/, 'Expected equipment images to support per-tab image scaling.');
assert.match(html, /setProperty\('--eq-object-fit',\s*d\.objectFit\s*\|\|\s*'cover'\)/, 'Expected the equipment tab switcher to apply a per-tab object fit.');
assert.match(html, /setProperty\('--eq-object-position',\s*d\.objectPosition\s*\|\|\s*'center center'\)/, 'Expected the equipment tab switcher to apply a per-tab object position.');
assert.match(html, /setProperty\('--eq-image-scale',\s*d\.imageScale\s*\|\|\s*'1'\)/, 'Expected the equipment tab switcher to apply a per-tab image scale.');
assert.match(html, /<h2 class="section-title">Преображения/, 'Expected a dedicated transformations section after the stats block.');
assert.match(html, /src="src\/beforeAfter\/1\.jpeg"/, 'Expected the first before/after image to be used in the transformations slider.');
assert.match(html, /src="src\/beforeAfter\/2\.jpeg"/, 'Expected the second before/after image to be used in the transformations slider.');
assert.match(html, /src="src\/beforeAfter\/3\.jpeg"/, 'Expected the third before/after image to be used in the transformations slider.');
assert.match(html, /src="src\/beforeAfter\/4\.PNG"/, 'Expected the fourth before/after image to be used in the transformations slider.');
assert.match(html, /src="src\/beforeAfter\/5\.PNG"/, 'Expected the fifth before/after image to be used in the transformations slider.');
assert.match(html, /class="transform-slider-track"/, 'Expected the transformations section to render a slider track.');
assert.match(html, /class="transform-nav-btn transform-prev"/, 'Expected the transformations slider to include a previous button.');
assert.match(html, /class="transform-nav-btn transform-next"/, 'Expected the transformations slider to include a next button.');
assert.match(html, /\.transform-media img\s*\{[\s\S]*object-fit:\s*contain;/, 'Expected before/after photos to be shown fully without cropping.');
assert.match(html, /const transformTrack = document\.querySelector\('\.transform-slider-track'\);/, 'Expected JavaScript to initialize the transformations slider.');
assert.match(html, /setInterval\(function\(\)\s*\{\s*renderTransformSlider\(currentTransformSlide \+ 1\);\s*\},\s*7000\);/, 'Expected the transformations slider to auto-advance every 7 seconds.');
assert.ok(!html.includes('История 01'), 'The transformations slider should no longer show story labels.');
assert.ok(!html.includes('transform-card'), 'The transformations slider should no longer render the old text card column.');
assert.match(html, /В клубе имеются дополнительные услуги\./, 'Expected the memberships block to mention that the club offers additional services.');
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
assert.match(html, /\.equipment-tabs\s*\{[\s\S]*flex-wrap:\s*wrap;/, 'Expected equipment tabs to wrap instead of forcing a horizontal scroller.');
assert.ok(!html.includes('overflow-x: auto;'), 'The equipment tabs should no longer use horizontal auto-scrolling.');
assert.match(html, /ИП Спешилов Сергей Юрьевич/, 'Expected the footer to show the updated sole proprietor name.');
assert.match(html, /ИНН:\s*590301237773/, 'Expected the footer to show the updated INN.');
assert.match(html, /ОГРН:\s*312590302400015/, 'Expected the footer to show the updated OGRN.');
assert.ok(!html.includes('ИП Иванова Ирина Ивановна'), 'The old placeholder sole proprietor name should be removed.');
assert.match(
  html,
  /<a href="\/consent">Соглашение на обработку данных<\/a>/,
  'Expected the footer consent link to open a standalone consent page.',
);
assert.match(
  html,
  /<a href="\/privacy-policy">Политика конфиденциальности<\/a>/,
  'Expected the footer privacy policy link to open a standalone policy page.',
);
assert.match(
  html,
  /<div class="modal-agree">[\s\S]*<a href="\/privacy-policy">политикой конфиденциальности<\/a>/,
  'Expected the modal consent text to link to the standalone privacy policy page.',
);
assert.match(
  html,
  /<div class="cta-agree">[\s\S]*<a href="\/consent">обработку персональных данных<\/a>/,
  'Expected the CTA form legal text to link to the standalone consent page.',
);

console.log('Header/mobile source checks passed.');
