# Set up pstack

In this page you install the plugin, pick which models pstack uses, and run your first task. Setup is one command plus a short conversation.

## Install the plugin

Clone the plugin into Amp's system plugin directory:

```bash
git clone https://github.com/pstack-ports/amp-pstack ~/.config/amp/plugins/pstack
```

Then reload plugins or start a new thread. The [README](../../README.md#install) covers every install location.

Amp prefixes plugin skills, so each command in this guide is `pstack:<name>` in Amp, such as `pstack:setup-pstack`. Name it in your message. The [Amp adapter](../../.agents/skills/poteto-mode/references/amp.md) covers the other differences.

## Pick your models

Run:

```text
/setup-pstack
```

[`/setup-pstack`](../../.agents/skills/setup-pstack/SKILL.md) detects the models you have access to, asks for a reasoning budget, shows you each role (code delegates, judgment, the review panels), and asks what you want. Answer the questions. It writes `.agents/pstack-models.md` in your project (or `~/.agents/pstack-models.md` if you ask for personal settings), a small file every pstack skill reads.

By default every role runs on your thread's model as an Amp `Task` subagent, and each review panel keeps its upstream seat count. A role you give its own model runs in its own Amp thread on that model. A budget sets the effort of the roles you gave a model: `large` is `xhigh`, `medium` lowers each role one level and `small` lowers it two, and both spend fewer tokens. No role runs above `xhigh`.

You only override what you care about. A role with no line in the file runs on your thread's model. To restore a default, delete that role's line. A rerun of `/setup-pstack` keeps any role whose model differs from the default. When a default changes, a file written before the change still pins the old default until you run `/setup-pstack` again. That run replaces the old defaults it recognizes, tells you which, and keeps your other choices. To drop a pin it does not recognize, delete that role's line or the file first.

Set a role to `inherit-parent` or `auto` and the subagent runs on your thread's model. Both values mean the same thing, and neither is a model ID. For a panel role the value is a list, and one subagent runs per entry, so the list length sets the panel size. Setup also configures `swarm workers`, the default model for every `/swarm` worker unless a race names a model for each arm.

## Accept the verification offers, or don't

At the end of setup, `/setup-pstack` looks for a way to prove app behavior in your project, either a `verify-*` skill or an existing harness. If it finds neither, it offers once to generate one with [`/create-verification-skill`](../../.agents/skills/create-verification-skill/SKILL.md).

Say yes and it writes `.agents/skills/verify-<app>/`, a project-local skill that teaches agents to drive your app the way a user does. It proves the skill works once before handing it over. Say no and setup moves on. You can run `/create-verification-skill` yourself any time. [Verify and ship](./06-verify-and-ship.md#create-a-project-verification-skill) covers it in depth.

If you're new to pstack, say yes. An agent that can check its own work keeps going until the check passes. An agent that can't hands every result back to you to check by hand. Of everything in this guide, the verification skill pays off the most.

Then setup offers once to generate a formal verification skill with [`/create-formal-verification-skill`](../../.agents/skills/create-formal-verification-skill/SKILL.md), unless the project already has one. Tests check the cases someone thought to write. A formal verification skill checks one key property of your code, such as "a job never runs twice at once", in every case within a stated scope. Say yes when your code has concurrency, retries, a state machine, or a parser, where a bug is costly and tests rarely reach the case that breaks. Otherwise say no, and run it later if that changes. [Verify and ship](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill) covers it.

The next pstack task reads the model file. No restart is needed.

## Keep the cost in check

pstack spends extra tokens on subagents and review panels. That's the price of the rigor. To spend fewer:

- Rerun `/setup-pstack` and pick a smaller reasoning budget or cheaper models. A strong model in the main chat with cheaper, faster models in the code roles is a good split.
- Set a role to `auto` or `inherit-parent` so it runs on the chat's own model.
- Shorten a panel list. Each entry runs one subagent.
- Save `/poteto-mode` for work that needs rigor. A small, obvious edit doesn't.

## Run your first task

Pick something real but small, and describe it the way you'd describe it to a colleague:

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

Watch the todo list. Its first items are the matched playbook's steps copied in, the Feature playbook for this prompt.

From here you can type normal follow-ups. The skill fades as the thread moves on, so name `pstack:poteto-mode` again when you start a new task.

Next: [Route work through `/poteto-mode`](./02-poteto-mode.md).
