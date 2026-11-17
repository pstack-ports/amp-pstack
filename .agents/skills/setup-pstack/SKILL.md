---
name: setup-pstack
description: Configure which Amp models pstack uses per role and at what reasoning budget. Detects your available models and writes the pstack model file that overrides the skill defaults. Use for /setup-pstack, "configure pstack models", "pstack budget", or changing pstack's model choices.
---

Before following this workflow, read the [Amp adapter](../poteto-mode/references/amp.md) once per session. Its tool, model, and host mappings apply to the upstream terminology below.

# Setup pstack

Write `.agents/pstack-models.md` in the active project, the file that sets pstack's model per role. Write `~/.agents/pstack-models.md` instead only when the user asks for personal settings; the project file wins when both exist. pstack skills read it through the Amp adapter; Amp does not load it as a rule.

## Steps

### 1. Detect available models

Call `list_agent_modes` (through `tool_search` and `code_exec` when it is deferred). It lists the models and reasoning efforts this user can start a thread on. Never write a model you have not confirmed is available. `inherit-parent` and `auto` are always valid even though they are not detected models.

`Task` subagents always run on the parent model. A role with an explicit model runs in its own Amp thread instead (`create_thread` with `model` and `effort`), as the adapter's Models section describes. Tell the user this once, so they can keep `inherit-parent` for roles that must work on unpushed local changes.

### 2. Load current state

Read the project file, otherwise the personal file. If one exists, treat its `# budget` line and its role values as the current choices. Otherwise start from the shape in step 5. A line whose role is not in step 5, such as `hardest tasks`, `architect runners`, `reflect tooling`, or `why investigators`, is from a retired role. Drop it and tell the user.

Upstream Cursor slugs, such as `claude-opus-5-5-xhigh-fast` or `gemini-4-carbon-high`, are not Amp model IDs. Replace each one with `inherit-parent` and say which values you replaced. Every other value is the user's choice and stays.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Prefer `ask_user_choice` over free text. Offer these options with these exact labels, and name the current budget when the file records one:

- `inherit-parent — keep the session's model and effort`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) Apply it.** A budget changes only explicit efforts; `inherit-parent` and `auto` do not change. For an explicit entry, move its effort on the ladder `xhigh` > `high` > `medium` > `low`: `large` keeps it, `medium` lowers it one step, and `small` lowers it two. No role runs above `xhigh`, and a target at the bottom of the ladder stays there. If the model does not offer the target effort, use its highest listed effort at or below the target, else leave the effort off and say so.

**(c) Show the roles and confirm.** Show every role with its value and each line step 2 dropped. Ask whether to accept as-is or change specific roles. Name the detected models and `inherit-parent` and `auto` (both mean: this role runs on the parent model) in text, because a full model list rarely fits `ask_user_choice`'s five options. A scalar role takes `inherit-parent`, `auto`, `<provider/model>`, or `<provider/model> <effort>`. Panel roles (arena runners, interrogate reviewers) take a comma-separated list, and one seat runs per entry, alias entries included, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena runs one judge. It tries only values from a vendor other than the parent's, in list order, so order it by preference. Fable and the other Claude models are one vendor. An `inherit-parent` or `auto` value never judges. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

### 4. Validate

Every explicit model and effort written must be in what step 1 detected, at `xhigh` or below. `inherit-parent` and `auto` always pass. If a chosen value is not available, stop and ask again.

### 5. Write the file

Overwrite the whole file so re-runs stay idempotent. It has no frontmatter. Use the `# defaults: 3` line, a `# budget` line with the chosen label, and one line per role, using the same labels poteto-mode uses. Role labels can contain commas, so a reader splits each line at its first colon. Shape:

```
# pstack model configuration. One line per role. Delete a line to fall back to inherit-parent.
# `inherit-parent` or `auto`: the role runs on the parent model with Task. A `<provider/model> <effort>` value runs the role in its own Amp thread. Alias entries in a panel list still count toward its fan-out.
# defaults: 3
# budget: inherit-parent
feature, refactoring: inherit-parent
bug-fix: inherit-parent
perf-issue: inherit-parent
hillclimb: inherit-parent
judgment and prose: inherit-parent
arena runners: inherit-parent, inherit-parent, inherit-parent
arena cross-judge pool: inherit-parent, inherit-parent
swarm workers: inherit-parent
interrogate reviewers: inherit-parent, inherit-parent, inherit-parent
```

### 6. Confirm

Tell the user the path you wrote. The next pstack task reads it; no restart is needed. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.

### 8. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill (a project skill that runs a model checker, a proof, or another verifier against the code). If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /create-formal-verification-skill." On yes, invoke `/create-formal-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.
