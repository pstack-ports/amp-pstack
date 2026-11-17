# benny

benny gives you two amp automations for slack issue reports. one triages each report. the other reproduces confirmed bugs and may prepare a small draft fix.

the files in this directory are dormant setup and automation sources. they do not appear as slash skills.

## set it up

1. point amp at [`FOR_AGENTS.md`](./FOR_AGENTS.md) and name the target repository.
2. let setup merge this whole directory into the target at `.agents/automations/benny/`. it must preserve destination-only files and review conflicts instead of overwriting local edits.
3. let setup install pstack in the target repository as an amp project plugin at `.amp/plugins/pstack/` for shared dependencies.

4. keep user-owned configuration outside the copied pack, for example in `.agents/benny/`. adapt [`configuration.example.yaml`](./templates/configuration.example.yaml) and [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md).
5. commit `.amp/plugins/pstack/`, `.agents/automations/benny/`, and any secret-free configuration before enabling either automation.
6. review each new automation's schedule and saved prompt on its amp thread, or update existing ones there. then send a harmless test report and verify every source-channel post stays in the original thread.
