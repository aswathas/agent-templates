---
name: i18n-rtl
description: Use when a UI has more than one language, or when it must support right-to-left scripts (Arabic, Hebrew, Persian, Urdu). Covers translation-safe layout, locale-aware formatting, text expansion, and RTL mirroring. Also use when reviewing a screen for the classic bugs — hardcoded strings, CSS-direction assumptions, and untranslatable UI.
user-invocable: false
---

Translation is not a text swap. German runs 30% longer than English. Arabic reverses the entire reading order. Japanese has no spaces. Every one of those breaks a layout that was only ever checked in English.

## The bugs that ship anyway

The most common i18n failures, in order of how often they appear:

- **Hardcoded strings.** Any literal in markup that is not a key. This is the root cause of everything below.
- **Concatenated sentences.** `"Welcome, " + name` cannot be reordered by a translator. Use a full string with a placeholder.
- **`uppercase` / `text-transform: uppercase`.** Wrong for Turkish (`i` → `İ`), German (`ß`), and most scripts entirely. Let the language decide.
- **Assumed left-to-right.** `left`/`right` in CSS, `margin-left`, `padding-right`, and hardcoded arrow icons.
- **Fixed widths on text.** Anything that assumes a known string length.
- **English-only validation.** Phone, date, currency, and number formats differ by locale.

## Layout rules that survive translation

- **Never use `left` or `right` for anything directional.** Use `start` and `end`, or `margin-inline-start` / `padding-inline-end`. This is the single highest-value rule.
- **Use logical properties throughout:** `margin-inline`, `padding-block`, `inset-inline-start`, `border-start-start-radius`. They flip automatically in RTL.
- **Text containers flex, never truncate by default.** `min-width: 0` on a flex child lets it shrink; without it, a long word overflows instead of wrapping. `overflow-wrap: anywhere` for URLs and long identifiers.
- **Icons that imply direction mirror.** Back arrows, chevrons, list bullets, progress. Check with `direction` — do not assume.
- **The layout itself does not mirror.** A sidebar is still on the side the platform puts it; the content inside reverses. Full-page mirroring is almost always wrong.

## RTL is not just Arabic

Set `dir="rtl"` on the document, and let the browser handle bidi. Do not reorder text yourself — you will break mixed LTR content inside RTL runs (a Latin product name, a number, a code snippet). The Unicode bidi algorithm handles this correctly and you do not want to reimplement it.

Numbers, prices, phone numbers, and code stay LTR inside an RTL paragraph. That is correct and the browser handles it.

## Format through the platform, never by hand

| Thing | Use |
|---|---|
| Date & time | `Intl.DateTimeFormat` with an explicit locale |
| Number | `Intl.NumberFormat` — grouping and decimal separators differ |
| Currency | `Intl.NumberFormat` with `style: "currency"`; never a `$` literal |
| Relative time | `Intl.RelativeTimeFormat` |
| List | Locale-aware joining — "a, b and c" is not universal |
| Plural | The ICU plural rules for the locale. English has two forms; Arabic has six. |

A hand-rolled `toFixed(2) + " USD"` is wrong in about a hundred locales. `Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })` is right in one.

## What to ask before building

1. **Which languages?** Not "we'll add them later" — the set determines the layout.
2. **Which locales?** `pt-BR` and `pt-PT` differ enough to matter.
3. **RTL at launch?** If it may come later, build `start`/`end` from day one. Retrofitting is a full re-audit of every stylesheet.
4. **Content length.** Long marketing copy, or short UI strings? This changes layout tolerance.
5. **Who translates, and do they see the layout?** Translators working from strings alone cannot see that a headline only fits because English is short. Give them context or leave them out of that decision.

## Testing that actually finds the bug

- Switch the locale in the running app. Do not read the source and guess.
- **Set a locale with 30% longer text** (German from English, or set the string to `iiiii...`) and look for clipping, truncation, and orphaned single words.
- **Toggle `dir="rtl"`** and check every rule above.
- Turn on a missing-translation fallback — the app will always render a string you did not translate.
- Check the longest plausible user-generated content: a 60-character name, a long email, a 4-line title. Those break layouts, not your test fixtures.

## Reference

Product UI mechanics and states → `app-ui`. Mobile-specific text sizing → `mobile-ui`. The brief → `discovery`.