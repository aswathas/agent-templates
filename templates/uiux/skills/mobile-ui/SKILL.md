---
name: mobile-ui
description: Use when building or reviewing native mobile UI — React Native, Expo, SwiftUI, Flutter, or a mobile web app. Covers touch targets, platform-native affordances, safe areas, offline and loading behavior, and the platform difference (iOS and Android are not one design). Not for desktop or responsive web, which belong to app-ui.
user-invocable: false
---

Mobile is not small desktop. The web's affordances — hover, right-click, a persistent sidebar, a wide click surface — do not exist here, and the fact that a layout fits 390px does not make it a mobile design.

## Decide which platform first

**iOS and Android are different products.** This is not a detail to reconcile later; it is the first decision.

| | iOS | Android |
|---|---|---|
| Navigation | Stack, edge-swipe back | Back button in the toolbar |
| Selection | Checkmark, fill | Radio/check semantics, ripple |
| Type | San Francisco | Roboto |
| Density | Generous, large hit areas | Compact, tighter spacing |
| Dialogs | Centered sheet or alert | Bottom sheet or dialog |
| Gestures | Swipe, pinch, long-press | All of the above + back gesture |

**Android must have a visible back affordance.** iOS gets the edge-swipe. If you build one layout and call it both, one platform loses.

Confirm with the user which platforms ship. If they say "iOS and Android," you still build two — you just do not have to ask twice.

## Touch targets

- **44×44pt on iOS, 48×48dp on Android.** These are the accessibility minimums, not design preferences.
- A 28px close button is unusable with a thumb on a moving bus, regardless of how it looks.
- **Space between adjacent targets ≥ 8px.** Adjacent 44px targets with no gap produce mis-taps, not dense UI.
- Primary actions sit in the **thumb zone** — bottom third of the screen. Destructive actions never sit next to the primary action, and never in a corner you reach with a thumb by accident.

## Gestures replace, never hide, an action

Every swipe, long-press, and pinch needs a visible equivalent. Users miss gestures constantly — motor ability, disability, and a plain wrong guess are all common.

- Swipe-to-delete needs a delete in a menu too.
- Long-press needs a visible overflow or a hint on first run.
- Never make an action gesture-only. Gesture is the fast path; the button is the real path.

## Layout that survives a real phone

- **Safe areas.** Notch, Dynamic Island, home indicator, and on Android the status and nav bars. Content must not sit under any of them.
- **Dynamic Type** — iOS users run up to 310% text size. Test at the largest setting. Layouts that break are usually fixed heights.
- **No hover.** Nothing may be reachable only on long-press of a hover state.
- **One-handed reach.** If the primary action needs two hands or a stretch, move it.
- Keyboard covering half the screen is normal, not an edge case. Every form must work with it open.
- Rotation on iPad is expected. Lock portrait only if the user asks.

## States, again, but different

Everything in `app-ui`'s state table applies, plus the ones only mobile has:

| State | Requirement |
|---|---|
| Offline | The app knows. Say what is cached and what is not. Never fail silently. |
| Backgrounded | Return to where the user was. Never lose a typed form. |
| Permission denied | Camera, location, notifications. Explain what you lose without it and route to Settings. |
| No network mid-request | Retry with a real retry. Never spin forever. |
| Low battery / low memory | Heavy animation and video degrade. Provide a lower-cost path. |
| Pull to refresh | Only where it fits. Never a substitute for a visible control. |
| Interruption | A call, a notification. The screen must survive it. |

## Performance is a design constraint

A phone is not a fast computer. That is not an excuse for a janky app.

- Animate `transform` and `opacity` only. Animating `width`, `height`, or `top` drops frames on device in a way it never does in a desktop browser devtools preview.
- List rows are virtualized past a few dozen items. A thousand-row flat list will stutter.
- Images are sized for the screen, downsampled from `srcset`, and lazy below the fold.
- **Test on a real device or a real simulator.** A browser preview of a mobile layout does not catch jank, safe-area bugs, or Dynamic Type failures.

## Accessibility

Everything in `app-ui` holds, plus:

- Minimum 44/48pt targets, verified not assumed.
- **Screen reader labelling on every icon-only control.** The platform's accessibility tree, not a tooltip.
- `accessibilityHint` for anything gesture-only — and remember the gesture needs a non-gesture path anyway.
- Announce state changes: a save completes, an item is deleted, a form errors.
- Announce numeric changes as the user adjusts a slider.
- Test with VoiceOver or TalkBack actually on. The tree looks fine and the experience is not.

## Reference

Desktop and responsive web → `app-ui`. Marketing → `taste-skill`. Data visualization → the `dataviz` skill. The six-line brief that routes you here → `discovery`.