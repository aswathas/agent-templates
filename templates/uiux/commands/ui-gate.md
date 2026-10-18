---
description: Run the brand-conditioned UI gate on the project
argument-hint: "[path]"
allowed-tools: Bash(node:*), Read, Glob, Edit, Write
---

Gate the project at $ARGUMENTS (default: the working directory).

```bash
node "$CLAUDE_PLUGIN_ROOT/tools/gate.mjs" "$ARGUMENTS" --severity warn
```

The gate reads the project's own tokens first, so brand-tier rules only fire
on colours the theme does not already own. A theme that declares terracotta is
not the AI default; a hardcoded one is.

**Fix every BLOCK before reporting.** Fix WARN where the fix is local. Leave a
WARN only when fixing it means changing something outside this surface, and say
which.

Report each fix as one line:

```
app/page.tsx:2  BLOCK  focus-removed  → replaced with focus-visible:ring-2 + offset
app/page.tsx:3  BLOCK  ai-purple      → --signal already declared in globals.css; switched the class to bg-signal
```

Re-run the gate after fixing. It must exit 0 before you call it done.

If a finding is a false positive, fix the code rather than arguing with the
meter. A gate you can talk your way out of is not a gate.