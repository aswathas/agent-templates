---
name: canvas-ui
description: Use when building canvas-based or direct-manipulation interfaces — diagram editors, node graphs, drawing tools, whiteboards, maps, drag-and-drop layouts, or anything with a persistent large viewport the user manipulates directly. Covers the pointer model, keyboard equivalents for every gesture, selection semantics, hit targets, and performance. Not for ordinary scrolling pages.
user-invocable: false
---

A canvas is the highest-cost UI to make accessible and the one where the model is most confident it succeeded. Pointer events, transforms, and hit-testing are straightforward to write and straightforward to get subtly wrong. The failure is invisible in a screenshot and total for the user.

## The rule

**Every gesture has a keyboard and button equivalent.** This is not an accessibility afterthought — it is the design. Drag, pinch, rotate, long-press: each one needs a visible path through the interface, or the feature is unfinished.

If a user cannot move a node without holding the mouse, you have shipped a broken editor.

## Pointer events, correctly

**Use Pointer Events, never separate mouse/touch handlers.** They unify mouse, touch, and pen, and they give you `pointerId` for free.

- **`setPointerCapture` on drag start.** Without it, a fast drag that leaves the element fires `pointercancel` and the interaction dies mid-gesture. This is the single most common canvas bug.
- **`touch-action: none`** on the canvas. Otherwise the browser claims the gesture for scrolling and the drag never starts on mobile.
- **Track one pointer id per interaction.** A second finger during a drag must not hijack it.
- **`e.preventDefault()` on `wheel`** if you zoom with it, and check `ctrlKey` before you suppress browser zoom — hijacking page zoom is an accessibility failure.
- Multi-touch needs explicit handling: two-finger pinch-zoom and one-finger pan must not conflict.

## Hit targets

- **Minimum 24×24 CSS px** for anything selectable on a canvas. Unlike a button's 44px, this one is competing with visual density, so the floor is lower but absolute.
- Nodes need a **hit area larger than the visual**. A 10px node with a 24px invisible hit area is correct; a 10px node you must click dead-on is not.
- Thin lines (connectors, handles) need a **transparent stroke** for hit-testing. A 1px visible line is a ~8px hit line in practice.
- Small elements inside a zoomed-out canvas must not shrink below the minimum. Scale the hit area inversely, or offer a zoom-to-selection.

## Selection

- Click selects. Shift-click extends. Marquee-drag selects everything intersecting. Escape clears. Cmd/Ctrl-A selects all. Undo reverses the last change.
- **Selection state is visible and announced** — not by color alone.
- Selected items get a visible affordance: outline, handles, or both.
- **Handles are keyboard reachable.** A resize handle you can only grab with the mouse is not a resize handle.
- Multi-select operations act on the whole set. No "only the last selected item moves" surprises.

## Keyboard model

A canvas needs its own key map, and it must not collide with the page's:

| Key | Action |
|---|---|
| Arrows | Nudge the selection (with Shift for larger steps) |
| Tab / Shift-Tab | Cycle through nodes on the canvas |
| Enter | Enter or edit the focused node |
| Escape | Cancel the current interaction, then clear selection |
| Delete / Backspace | Remove selection |
| Cmd/Ctrl-Z / Shift+Z | Undo / redo |
| Cmd/Ctrl-A | Select all |
| Cmd/Ctrl-D | Duplicate |
| Cmd/Ctrl+G | Group |
| Space (hold) | Temporary pan |

Document the map in the UI. A canvas with an invisible shortcut set is a canvas that only power users can use.

## Performance

- **Transform for movement, never layout.** `transform: translate3d()` for dragging. Setting `left`/`top` on hundreds of nodes per frame is what makes canvas UIs feel broken.
- **Batch DOM reads and writes.** Never read layout inside a render or a pointermove handler. Read once on gesture start, write on `requestAnimationFrame`.
- **An `rAF` loop, not a pointermove handler doing layout work.** Coalesce pointer moves into one frame.
- **Virtualize off-screen nodes** past a few hundred. A thousand rendered nodes is a dropped frame, every frame.
- **Memoize and keep the node tree stable.** A new object identity per render re-renders the whole subtree.
- Long-press and drag need a threshold, not an instant trigger — or every tap becomes a drag.

## Empty, loading, error

A canvas has all of `app-ui`'s states, plus its own:

- **Empty canvas** is a first-run moment. Say what to do and make it one click — a template, an import, or a blank start.
- **Loading a large document** shows progress and stays interactive where possible.
- **Import failure** names the file and the reason. Never "something went wrong."
- **Unsaved changes** block navigation with a real prompt, and autosave is not an excuse to lose work.
- **Too large to open** says what the limit is.

## Reference

Ordinary product UI → `app-ui`. Marketing → `taste-skill`. Touch gestures and platforms → `mobile-ui`. The brief → `discovery`.