import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(
  html,
  /<meta name="description" content="[^"]{80,}">/,
  'Expected a substantial meta description for search snippets.',
);
assert.match(
  html,
  /<link rel="canonical" href="https:\/\/тонус-клуб\.рф\/">/,
  'Expected the page to declare the production canonical URL.',
);
assert.match(
  html,
  /<meta name="robots" content="index, follow, max-image-preview:large">/,
  'Expected robots directives for the public landing page.',
);
assert.match(html, /<meta property="og:type" content="website">/, 'Expected Open Graph type metadata.');
assert.match(html, /<meta property="og:locale" content="ru_RU">/, 'Expected a Russian Open Graph locale.');
assert.match(
  html,
  /<meta property="og:site_name" content="Тонус-Клуб Пермь">/,
  'Expected the business name in Open Graph metadata.',
);
assert.match(
  html,
  /<meta property="og:url" content="https:\/\/тонус-клуб\.рф\/">/,
  'Expected the Open Graph URL to match the canonical domain.',
);
assert.match(
  html,
  /<meta property="og:image" content="https:\/\/тонус-клуб\.рф\/src\/greenplaza\.jpg">/,
  'Expected the Open Graph image to point at a real local asset.',
);
assert.match(
  html,
  /<meta name="twitter:card" content="summary_large_image">/,
  'Expected Twitter card metadata for social previews.',
);
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Expected exactly one H1 on the page.');
assert.match(html, /<h1 class="hero-title">/, 'Expected the hero headline to be promoted to the page H1.');

const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(jsonLdMatch, 'Expected structured data for the club.');

const structuredData = JSON.parse(jsonLdMatch[1]);
assert.equal(structuredData['@context'], 'https://schema.org');
assert.equal(structuredData['@type'], 'HealthClub');
assert.equal(structuredData.name, 'Тонус-Клуб Пермь');
assert.equal(structuredData.url, 'https://тонус-клуб.рф/');
assert.equal(structuredData.telephone, '+7-342-203-03-90');
assert.equal(structuredData.address.streetAddress, 'ул. Куйбышева, 95Б, БЦ Green Plaza, 5 этаж');
assert.equal(structuredData.address.addressLocality, 'Пермь');
assert.equal(structuredData.address.addressCountry, 'RU');
assert.equal(structuredData.geo.latitude, 56.247158);
assert.equal(structuredData.geo.longitude, 57.99081);
assert.deepEqual(structuredData.sameAs, [
  'https://vk.com/tonusclubperm',
  'https://www.instagram.com/tonus_club_perm/',
]);

const robotsUrl = new URL('../robots.txt', import.meta.url);
assert.ok(existsSync(robotsUrl), 'Expected a robots.txt file at the project root.');

const robots = readFileSync(robotsUrl, 'utf8');
assert.match(robots, /^User-agent: \*$/m, 'Expected robots.txt to target all crawlers.');
assert.match(robots, /^Allow: \/$/m, 'Expected robots.txt to allow indexing of the landing page.');
assert.match(
  robots,
  /^Sitemap: https:\/\/тонус-клуб\.рф\/sitemap\.xml$/m,
  'Expected robots.txt to advertise the sitemap URL.',
);

const sitemapUrl = new URL('../sitemap.xml', import.meta.url);
assert.ok(existsSync(sitemapUrl), 'Expected a sitemap.xml file at the project root.');

const sitemap = readFileSync(sitemapUrl, 'utf8');
assert.match(sitemap, /<loc>https:\/\/тонус-клуб\.рф\/<\/loc>/, 'Expected the homepage in the XML sitemap.');
assert.match(sitemap, /<changefreq>weekly<\/changefreq>/, 'Expected a crawl frequency hint.');
assert.match(sitemap, /<priority>1\.0<\/priority>/, 'Expected the homepage priority in the sitemap.');

console.log('SEO checks passed.');
