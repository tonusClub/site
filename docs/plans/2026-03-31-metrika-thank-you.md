# Metrika And Thank-You Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove Instagram from the public site, redirect successful leads to a dedicated thank-you page, and wire Yandex.Metrika through a configurable counter ID.

**Architecture:** Keep the site static, but let the Node HTTP server inject the Metrika snippet into HTML responses so the counter ID can come from `YANDEX_METRIKA_ID`. Use a dedicated `/spasibo` page for post-submit UX and a Metrika `reachGoal('spasibo')` trigger on that page.

**Tech Stack:** Static HTML, inline client-side JavaScript, Node HTTP server, `node:test`.

### Task 1: Lock the new behavior in tests

**Files:**
- Modify: `tests/header-layout.test.mjs`
- Modify: `tests/seo.test.mjs`
- Modify: `tests/lead-form.test.mjs`
- Modify: `tests/http-server.test.mjs`
- Create: `tests/thank-you-page.test.mjs`

**Step 1: Write the failing tests**

Add assertions for:
- no Instagram links or icon markup in `index.html`
- JSON-LD `sameAs` only containing VK
- client-side redirect to `/spasibo` after a successful form submit
- server support for `/spasibo` and extensionless HTML routes
- Metrika snippet injection and thank-you goal marker

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL on missing thank-you page, missing redirect, and Instagram still present.

### Task 2: Implement the minimal site changes

**Files:**
- Modify: `index.html`
- Create: `spasibo.html`

**Step 1: Remove Instagram**

Delete Instagram links, icon markup, and the extra `sameAs` entry while keeping VK intact.

**Step 2: Redirect successful leads**

Change the success path in `submitLeadForm()` so the browser navigates to `/spasibo`.

**Step 3: Add the thank-you page**

Create a lightweight `spasibo.html` with:
- `noindex, nofollow`
- success copy
- a CTA back to `/`
- markers for Metrika head injection and thank-you goal injection

### Task 3: Inject Metrika at the server layer

**Files:**
- Modify: `server/http-server.mjs`
- Modify: `server/index.mjs`
- Modify: `.env.example`

**Step 1: Add extensionless HTML routing**

Allow `/consent`, `/privacy-policy`, and `/spasibo` to resolve to matching `.html` files.

**Step 2: Inject Metrika into HTML responses**

Read HTML files as text and replace:
- `<!--YANDEX_METRIKA_HEAD-->`
- `<!--YANDEX_METRIKA_GOAL-->`

Use `YANDEX_METRIKA_ID` as the counter ID and omit the snippet when the env var is missing or invalid.

**Step 3: Document the environment variable**

Add `YANDEX_METRIKA_ID` to `.env.example`.

### Task 4: Verify

**Files:**
- No code changes expected

**Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS with all tests green.
