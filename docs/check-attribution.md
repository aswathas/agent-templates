# Attribution check

`check-attribution.sh` verifies your commits land on **your** GitHub profile and
not someone else's.

```bash
bash ~/check-attribution.sh                        # current repo
bash ~/check-attribution.sh ~/agent-templates ~/postiee
```

## Why this exists

GitHub maps a commit to a profile by its **author email**. If that email belongs
to a different account, the commit leaves your profile silently — no warning, no
failed push.

That is not hypothetical. On 2026-10-18, eleven commits on `agent-templates` and
one on `postiee` were authored with `aswathas13@gmail.com`, which GitHub resolves
to a **different account**. They appeared under that profile instead of yours.
Recovering meant rewriting history and force-pushing both repos.

The trap: `aswathas13@gmail.com` is also the **personal Gmail** used by the `gws`
mail CLI. It is correct for mail and wrong for commits, so it sits in
`CLAUDE.md` looking harmless.

## Your addresses

| Address | Good for commits? |
|---|---|
| `aswathas20@gmail.com` | ✅ Use this |
| `<id>+aswathas@users.noreply.github.com` | ✅ Resolves to the same account |
| `aswathas13@gmail.com` | ❌ Belongs to a different account |

The script accepts the first two and flags the third.

## Running it

After the first push to any new repo, and whenever something looks off:

```bash
bash ~/check-attribution.sh ~/some-new-repo
```

Reading the output:

- `ok` — every commit resolves to your account
- `WRONG` — the listed emails belong to someone else's account. Fix with a
  history rewrite; adding new commits will not move old ones.

## Fixing a mismatch

```bash
git config user.email aswathas20@gmail.com   # prevents it recurring

git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "the.wrong@email" ]; then
  export GIT_AUTHOR_EMAIL="aswathas20@gmail.com"
  export GIT_COMMITTER_EMAIL="aswathas20@gmail.com"
fi' -- --all

git push --force-with-lease origin main
```

Back up first: `git clone <repo> ~/backup-<name>`. A force-push over rewritten
history is not undoable from the remote.

Check the remote has no extra branches or tags you would strand before
rewriting a repo that has them — `postiee` has a `gh-pages` branch and a `v0.1.0`
tag that a rewrite leaves behind.

## Confirming it worked

```bash
gh api repos/OWNER/REPO/contributors --jq '.[] | "\(.login) \(.contributions)"'
```

GitHub recomputes this asynchronously, so give it a minute after a force-push.

## Prevention

Global config is set, so a new repo inherits it:

```bash
git config --global user.email     # aswathas20@gmail.com
```