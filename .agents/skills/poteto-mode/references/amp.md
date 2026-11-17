# Amp adapter

Read this once per session before following any pstack workflow. Apply these mappings wherever the preserved upstream text uses Cursor tool names, paths, or features. Include this file's absolute path in every delegate's brief. Amp's system prompt, tool schemas, permissions, and the user's authorization always take precedence over a workflow.

## Skills and paths

pstack is an Amp directory plugin. The plugin root holds `index.ts`, `plugin.json`, `.agents/skills/`, `agents/`, and `docs/`; it is four directories above this file. `index.ts` registers every skill under `.agents/skills/` as `pstack:<name>`. A skill whose frontmatter has `disable-model-invocation: true` is registered unlisted: it stays out of the skill list but loads with the `skill` tool by its qualified name. Upstream `/name` examples mean `pstack:<name>`, such as "use pstack:poteto-mode to …". When a workflow routes to a sibling skill, read `../<name>/SKILL.md` from a skill directory and follow it, or load `pstack:<name>` with the `skill` tool.

An upstream path `pstack/skills/<path>` means `<plugin-root>/.agents/skills/<path>`; other bundled upstream paths resolve from the plugin root. Read bundled files locally instead of fetching them. A `git show <ref>:pstack/skills/<path>` instruction, or a request to re-read a bundled playbook from trunk, means read the installed plugin file; pstack is not in the target repository's Git tree. Record the plugin root and `plugin.json` version at program start and give delegates absolute paths. Run bundled `scripts/<path>` through the owning skill's absolute directory while keeping the working directory in the target repository or worktree.

Project skills go in `.agents/skills/<name>/SKILL.md`, personal skills in `~/.agents/skills/<name>/SKILL.md`. Amp discovers skills up to five directories below each root, so personal category directories work. Upstream `create-skill` means Amp's built-in `building-skills` skill. Never edit the installed plugin (`~/.config/amp/plugins/pstack/`, `.amp/plugins/pstack/`, or a global plugin repository checkout); that is what upstream `plugins/cache/` means. The bundled `deslop`, `control-cli`, and `control-ui` skills are part of this plugin. The role files in `agents/` are briefs that a delegate reads, not registered agent types.

## Durable state

Where upstream says the agent's store, the root agent's store, or the Project store, use `${XDG_STATE_HOME:-~/.local/state}/pstack/<workspace-key>/`, and keep the Project tracker as `notes.md` there. Derive the key from the primary Git worktree's directory name plus the first 12 hex characters of the SHA-256 of its canonical absolute path, so linked worktrees share state and unrelated repositories do not collide. Outside Git, use the canonical workspace path. Record the resolved directory in the plan and every delegate brief. Plans go under its `docs/`. An orb's disk does not outlive the orb, so a cloud worker pushes its trail to its branch as upstream requires.

## Tools and delegation

Use only tools and arguments the session actually exposes. Deferred Amp tools, such as `find_thread`, `get_thread_status`, and `set_schedule`, are called through `tool_search` and `code_exec`.

| Upstream instruction | Amp operation |
| --- | --- |
| `Task` | Amp's `Task` tool. Put the whole brief in `prompt` and a short `description`. |
| `subagent_type`, `generalPurpose`, `poteto-agent`, `comment-sicko` | Amp has one general subagent. Put the role in the brief. For the two pstack roles, make the brief's first instruction `Read <plugin-root>/agents/<role>.md first.` |
| `readonly: true` | Tell the subagent to inspect only and never edit, then check `git status` afterwards. |
| `run_in_background: true` | `mode: "async"`. Results arrive in a later message; do not poll. |
| `resume`, follow-up | `Task` with the returned `id`. Keep upstream's preference for a fresh worker unless the state is costly to transfer. |
| `model` on a spawn | See Models below. `Task` takes no model. |
| `environment: "cloud"`, cloud agent, Project worker | `create_thread` with `executor: "orb"`: an Amp orb is a cloud machine with its own checkout of the project's default branch. A `cloud_base_branch` must already be pushed; name it in the prompt. Pushing needs the user's authorization. Without that, create a local Git worktree and give its absolute path to a `Task` subagent. |
| Agents dashboard, worker status, waiting on Project workers | `get_thread_status`, `wait_for_threads`, `read_thread`, and `send_thread_message` with the thread IDs you saved. Ask a worker to reply, or wait on it; never both. |
| `file_attachments` | Absolute file paths in the brief. |
| `AskQuestion` | `ask_user_choice` when the choices fit its five options: one call per independent question, in parallel. Otherwise list the choices in text and ask. Required approval must get a real answer. |
| Todo list | A todo tool if the session exposes one; otherwise keep the checklist in the reply, or in an artifact for a long run. |
| `Read`, `Grep`, `Glob`, `Shell` | `Read`, or `shell_command` with `rg`, `rg --files`, and bounded reads. |
| `SendToUser` secret request | `manage_amp` topic `secrets`, operation `set`, without a value, so Amp asks the user privately. Never request a secret in chat. |

When subagents or threads are unavailable or disallowed, say which independent check cannot run and do the useful serial work. Never claim an independent review that did not happen. A skill does not authorize pushes, external messages, deployments, or other gated actions beyond the user's request.

## Models

At task start read `.agents/pstack-models.md` in the active project when present, otherwise `~/.agents/pstack-models.md`. pstack reads this file explicitly; Amp does not load it as a rule. Do not write model choices into `AGENTS.md` or Amp settings.

The upstream Cursor slugs (`claude-opus-5-5-xhigh-fast`, `gemini-4-carbon-high`, and so on) are historical defaults. In Amp, **every unconfigured role inherits the parent model**: spawn it with `Task`. A panel with no configuration keeps its upstream seat count, one fresh parent-model subagent per seat; describe these as independent perspectives on one model, not several model families.

A configured value is `inherit-parent`, `auto`, `<provider/model>`, or `<provider/model> <effort>`, using IDs and efforts that `list_agent_modes` reports. `inherit-parent` and `auto` mean `Task`. An explicit model needs its own thread: `create_thread` with `model` and, when given, `effort`, under the executor rules in the table above. When that is impossible, such as unpushed local work the user has not authorized pushing, run the seat with `Task` on the parent model and disclose the fallback once. Never guess a model ID or append an effort suffix to one.

## History

Upstream transcripts in `agent-transcripts/` are Amp threads. Use `find_thread` to list threads for the active repository or workspace, and `read_thread` to read one. Stay inside the active workspace unless the user includes another. If history is unavailable, use the visible conversation and say what evidence is missing.

For `worktree-audit.sh`, optionally set `PSTACK_TRANSCRIPTS_DIR` to a directory of already scoped thread exports. Without it the audit omits chat recency; that is not evidence that no recent chat exists.

## Host features

| Upstream feature | Amp behavior |
| --- | --- |
| Custom Modes, Option/Alt+Enter, Plan Mode | Load `pstack:poteto-mode` for each task that needs it. Do not promise Cursor UI gestures. |
| `/loop`, `/loop 1h` | An Amp schedule on this thread: load the `building-schedules` skill when the user asked for unattended or repeated work. Otherwise keep working in the session, and do not promise continuation after it ends. |
| Cursor Automations, `/automate`, `update_state` routines, webhook routines | Amp schedules for timed runs, and `amp.createWebhook` in a project plugin loaded in an orb thread for HTTP triggers. Slack and tracker events need an integration that actually exists; if none does, draft the prompts and configuration and report what is missing. Never call a Cursor backend. Where a workflow reads a `trigger`, such as benny's operational skills, a scheduled run reads the newest unhandled source message with the Slack tools instead, and `trigger.channel`, `trigger.ts`, and `trigger.thread_ts` are that message's values. |
| Cursor's built-in babysit skill | Not present. Use the Babysit playbook. |
| Bugbot, agentic security review | Read existing forge checks and bot comments as ordinary review evidence. Do not start or wait for a service the repository does not use. For an independent review, brief a reviewing `Task` subagent. |
| Grok Bot | An Amp orb thread. See `make-bot-ui`. |

When a step needs a missing host feature, record `unavailable: <feature>; <effect on the task>` and continue the independent work. If the missing result is necessary for the outcome, report the remaining dependency. Never invent a URL, credential, trigger, passing check, or approval.
