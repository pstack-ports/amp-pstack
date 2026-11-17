import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PluginAPI } from '@ampcode/plugin'

export const description =
	'pstack by Lauren Tan: rigorous engineering workflows, playbooks, and principles as pstack:<name> skills. Start with pstack:setup-pstack, then pstack:poteto-mode.'

const skillsDir = join(import.meta.dir, '.agents', 'skills')

export default async function (amp: PluginAPI) {
	for (const entry of await readdir(skillsDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue
		const skill = await readFile(join(skillsDir, entry.name, 'SKILL.md'), 'utf8')
		const frontmatter = skill.split(/^---$/m, 2)[1] ?? ''
		await amp.registerSkill({
			path: `.agents/skills/${entry.name}`,
			listed: !/^disable-model-invocation:\s*true\s*$/m.test(frontmatter),
		})
	}
}
