# Header And Mobile Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the dark framing around the header logo, replace incorrect social icons with the VK and Instagram assets from `src`, and make the landing page usable on mobile screens.

**Architecture:** Keep the site as a single static HTML file. Fix the logo visually with container cropping instead of replacing the asset, switch social buttons from inline SVG to local image assets, and add responsive CSS plus a compact mobile navigation toggle for the header and stacked layouts for content sections.

**Tech Stack:** Static HTML, inline CSS, inline vanilla JavaScript, Node.js for a minimal source-level regression test

### Task 1: Guard The Required Header Changes

**Files:**
- Create: `tests/header-layout.test.mjs`
- Test: `index.html`

**Step 1: Write the failing test**

Create assertions that require:
- local Instagram and VK assets in the markup
- no Odnoklassniki social button class in the markup
- a mobile media query
- a mobile menu toggle button
- logo overflow cropping styles

**Step 2: Run test to verify it fails**

Run: `node tests/header-layout.test.mjs`
Expected: FAIL because the current header still contains the old social button markup and has no mobile navigation rules.

### Task 2: Update Header Markup And Styles

**Files:**
- Modify: `index.html`

**Step 1: Replace incorrect header and footer social markup**

Use only `src/vk.png` and `src/inst.webp`.

**Step 2: Fix visible logo framing**

Crop the existing logo inside a rounded wrapper so the black image background does not show.

**Step 3: Add mobile navigation and responsive rules**

Introduce a menu toggle button, responsive spacing, stacked hero/section layouts, smaller paddings, and mobile-safe button/input widths.

### Task 3: Verify

**Files:**
- Test: `tests/header-layout.test.mjs`
- Test: `index.html`

**Step 1: Re-run the source regression test**

Run: `node tests/header-layout.test.mjs`
Expected: PASS

**Step 2: Sanity-check the HTML**

Run a quick HTML parse or search to confirm that the new mobile toggle and asset references are present and that old social markup is removed.
