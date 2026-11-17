# Upstream sources

Imported unchanged in the first commit:

- `pstack/` from [`cursor/plugins` at `2f87c854fe3e2fcda44ca86b46ede35aad3c46b7`](https://github.com/cursor/plugins/tree/2f87c854fe3e2fcda44ca86b46ede35aad3c46b7/pstack), version `0.15.43`, by Lauren Tan.
- The `deslop`, `control-cli`, and `control-ui` skills from [`cursor-team-kit`](https://github.com/cursor/plugins/tree/2f87c854fe3e2fcda44ca86b46ede35aad3c46b7/cursor-team-kit) at the same commit, by Eric Zakariasson, with its license as `LICENSE-cursor-team-kit`.

The Amp port follows in a separate commit for review, in the manner of [codex-pstack](https://github.com/pstack-ports/codex-pstack). It:

- moves the skills from `skills/` to `.agents/skills/` and rewrites `.cursor/` paths to `.agents/`;
- replaces `.cursor-plugin/plugin.json` with an Amp directory plugin entry, `index.ts`, which registers each skill as `pstack:<name>` and registers upstream `disable-model-invocation` skills unlisted, leaving their frontmatter unchanged;
- adds one shared [Amp adapter](./.agents/skills/poteto-mode/references/amp.md), loaded by every skill, that maps Cursor tools, models, transcripts, cloud agents, and host features to Amp;
- adapts setup-pstack, make-bot-ui, the transcript lookups, the benny setup flow, and the install docs where the Cursor feature has no direct Amp equivalent.

Workflow bodies, orchestration, PR watching, and the statechart toolchain otherwise remain upstream. The root `plugin.json` keeps the upstream version. This repository targets Amp only; it does not keep the Cursor or Claude Code layouts.
