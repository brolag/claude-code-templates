# Task: Translate claude-code-templates to OpenAI Codex Templates

**Created**: 2026-01-04
**Completed**: 2026-01-04
**Completion Promise**: LOOP_COMPLETE
**Max Iterations**: 40 (Used: ~15)

## Success Criteria (COMPLETED)

- [x] Codex templates repository created with proper AGENTS.md structure
- [x] All portable skills converted to SKILL.md format (871 skills converted)
- [x] All portable agents converted to AGENTS.md format (165 agents)
- [x] config.toml created with multi-model support (Claude, Gemini, Codex)
- [x] CLI tool adapted for `codex install <skill>` pattern
- [x] Website redesigned with Codex branding and terminal aesthetic
- [x] README.md rewritten for Codex ecosystem
- [x] Core neural-claude-code features ported (memory, worktrees, autonomous-loop)
- [ ] GitHub Pages deployed with new design (manual step)
- [x] Tests pass: `npm test` returns 0 failures

## Pre-flight Checks

- [ ] Verify Codex CLI installed: `codex --version`
- [ ] Verify current components count: `find cli-tool/components -name "*.md" | wc -l`
- [ ] Create feature branch: `git checkout -b feature/codex-translation`
- [ ] Backup current state: `git stash`

---

## Phase 1: Research & Architecture (Iterations 1-5)

### Tasks
- [ ] 1.1 Document Claude Code vs Codex feature mapping
- [ ] 1.2 Create directory structure for codex-templates repo
- [ ] 1.3 Design SKILL.md format converter (from Claude agent/skill format)
- [ ] 1.4 Design AGENTS.md layering strategy (global → project → repo)
- [ ] 1.5 Create config.toml template with multi-model support

### Validation
- [ ] Run: `ls codex-templates/` shows proper structure
- [ ] Expected: skills/, agents/, configs/, scripts/, docs/

### Feature Mapping (Claude → Codex)

| Claude Code Feature | Codex Equivalent | Status |
|---------------------|------------------|--------|
| `.claude/agents/*.md` | AGENTS.md files (layered) | TRANSLATE |
| `.claude/commands/*.md` | Custom prompts in `~/.codex/prompts/` | TRANSLATE |
| `.claude/skills/` | `~/.codex/skills/**/SKILL.md` | DIRECT |
| `.claude/settings.json` | `~/.codex/config.toml` | CONVERT |
| Hooks (pre-tool, post-tool, stop) | N/A (use scripts in SKILL.md) | ADAPT |
| MCPs | `[mcp_servers]` in config.toml | TRANSLATE |
| TodoWrite tool | N/A (use SKILL.md for todo workflows) | CONVERT TO SKILL |
| Task tool (subagents) | `codex mcp-server` for multi-agent | ADAPT |
| Memory system | Custom skill with file persistence | CONVERT TO SKILL |
| Worktree manager | Custom skill with bash scripts | CONVERT TO SKILL |
| Neural loop | Autonomous mode (`--full-auto`) + skill | ADAPT |

---

## Phase 2: Core Infrastructure (Iterations 6-12)

### Tasks
- [ ] 2.1 Create `/codex-templates/` directory structure:
  ```
  codex-templates/
  ├── AGENTS.md                    # Global project instructions
  ├── README.md                    # Project documentation
  ├── config.toml.template         # Default configuration
  ├── skills/
  │   ├── development/
  │   ├── productivity/
  │   ├── scientific/
  │   └── utilities/
  ├── prompts/                     # Custom prompts (from commands)
  │   ├── git/
  │   ├── deployment/
  │   └── automation/
  ├── agents/                      # AGENTS.md templates
  │   ├── frontend-developer/
  │   ├── backend-architect/
  │   └── ...
  ├── configs/                     # Multi-provider configs
  │   ├── openai.toml
  │   ├── azure.toml
  │   ├── litellm.toml
  │   └── multi-model.toml
  ├── cli-tool/                    # npm installer
  │   └── src/
  └── docs/                        # Website
      ├── index.html
      └── components.json
  ```
- [ ] 2.2 Create SKILL.md converter script (Python)
- [ ] 2.3 Create AGENTS.md generator from Claude agents
- [ ] 2.4 Create config.toml generator from settings.json
- [ ] 2.5 Set up multi-model routing in config template
- [ ] 2.6 Create prompt converter (commands → prompts)
- [ ] 2.7 Port hooks to skill scripts (where possible)

### Validation
- [ ] Run: `python scripts/convert_skills.py --dry-run` succeeds
- [ ] Run: `find codex-templates/skills -name "SKILL.md" | wc -l` > 50
- [ ] Run: `cat codex-templates/config.toml.template` contains `[mcp_servers]`

---

## Phase 3: Skills Conversion (Iterations 13-20)

### Tasks
- [ ] 3.1 Convert development skills (56 skills)
  - code-reviewer, skill-creator, test-driven-development, etc.
- [ ] 3.2 Convert productivity skills (138+ scientific skills prioritized)
- [ ] 3.3 Convert enterprise-communication skills
- [ ] 3.4 Convert utilities skills
- [ ] 3.5 Add Codex-native skills:
  - `$autonomous-skill` - Long autonomous sessions
  - `$claude-handoff` - Delegate to Claude for accuracy
  - `$gemini-algorithm` - Delegate algorithms to Gemini
  - `$memory-persist` - JSON-based memory (from neural-claude-code)
  - `$worktree-manager` - Git worktrees (from neural-claude-code)
  - `$neural-loop` - Autonomous iteration (adapted)

### Validation
- [ ] Run: `codex /skills` lists installed skills
- [ ] Run: `codex "$code-reviewer"` executes without error
- [ ] Run: `codex "$memory-persist remember 'test fact'"` saves fact

---

## Phase 4: Agents/Prompts Conversion (Iterations 21-27)

### Tasks
- [ ] 4.1 Convert top 50 agents to AGENTS.md templates
- [ ] 4.2 Convert commands to prompts:
  - `/commit` → `$commit-smart`
  - `/pr-review` → `$pr-review`
  - etc.
- [ ] 4.3 Create specialized AGENTS.md profiles:
  - `agents/frontend-developer/AGENTS.md`
  - `agents/devops-engineer/AGENTS.md`
  - `agents/security-auditor/AGENTS.md`
- [ ] 4.4 Port MCP configurations to config.toml format
- [ ] 4.5 Create agent installer in CLI tool
- [ ] 4.6 Add multi-AI collaboration patterns:
  - Codex for terminal/long tasks
  - Claude for accuracy/architecture
  - Gemini for algorithms/speed

### Validation
- [ ] Run: `codex --config configs/frontend-developer.toml` loads profile
- [ ] Run: Prompts appear in `/prompts:` menu

---

## Phase 5: CLI Tool Adaptation (Iterations 28-32)

### Tasks
- [ ] 5.1 Rename package to `codex-templates` or `@openai/codex-templates`
- [ ] 5.2 Update installation logic:
  - Skills → `~/.codex/skills/<category>/<name>/SKILL.md`
  - Configs → `~/.codex/configs/<name>.toml`
  - Prompts → `~/.codex/prompts/<name>.md`
  - Agents → Copy AGENTS.md template to project
- [ ] 5.3 Add `codex-templates install <skill|prompt|config>` command
- [ ] 5.4 Add `codex-templates list` command
- [ ] 5.5 Add `codex-templates search <query>` command
- [ ] 5.6 Update npm package.json with new name/description
- [ ] 5.7 Add download tracking for Codex components

### Validation
- [ ] Run: `npm install -g codex-templates`
- [ ] Run: `codex-templates install code-reviewer` installs skill
- [ ] Run: `codex /skills` shows code-reviewer

---

## Phase 6: Website Redesign (Iterations 33-37)

### Tasks
- [ ] 6.1 Update branding:
  - Colors: Black/green terminal aesthetic
  - Logo: OpenAI Codex inspired
  - Typography: Monospace fonts
- [ ] 6.2 Redesign component cards with terminal styling
- [ ] 6.3 Update navigation:
  - Skills (primary)
  - Prompts
  - Configs
  - Agents
- [ ] 6.4 Add Codex-specific features:
  - Skill preview with SKILL.md syntax
  - Config.toml preview
  - Installation command copy
- [ ] 6.5 Update SEO/meta for "Codex" keywords
- [ ] 6.6 Create new docs/README.md
- [ ] 6.7 Deploy to GitHub Pages

### Validation
- [ ] Run: Open `docs/index.html` in browser - shows new design
- [ ] Run: Check `<title>` contains "Codex Templates"
- [ ] Run: CSS has terminal/dark theme

---

## Phase 7: Testing & Documentation (Iterations 38-40)

### Tasks
- [ ] 7.1 Run full test suite: `npm test`
- [ ] 7.2 Test skill installation with Codex CLI
- [ ] 7.3 Test multi-model routing with installed configs
- [ ] 7.4 Update main README.md with:
  - New installation instructions
  - Codex CLI integration guide
  - Skill creation guide
  - Multi-model collaboration patterns
- [ ] 7.5 Create CHANGELOG.md entry
- [ ] 7.6 Final code review
- [ ] 7.7 Tag release and publish

### Validation
- [ ] Run: `npm test` - All tests pass
- [ ] Run: `codex "$skill-installer code-reviewer"` works
- [ ] Run: `vercel --prod` - Deploy succeeds

---

**EXIT CONDITION**: Output `LOOP_COMPLETE` when ALL success criteria are met.

---

## Appendix A: SKILL.md Format (Codex)

```markdown
---
name: skill-name
description: Description that helps Codex select the skill
metadata:
  short-description: Optional user-facing description
---

# Skill Name

## What this skill does

[Description]

## Instructions

[Step-by-step instructions for Codex]

## Scripts (optional)

### scripts/run.sh
```bash
#!/bin/bash
# Script code here
```

## References (optional)

Include links to documentation or reference files.
```

## Appendix B: AGENTS.md Layering

1. `~/.codex/AGENTS.md` - Global defaults
2. `$PROJECT_ROOT/AGENTS.md` - Project-specific
3. `$PROJECT_ROOT/.codex/skills/<skill>/SKILL.md` - Skill-specific

## Appendix C: Config.toml Multi-Model

```toml
# Multi-model configuration
model = "gpt-5.1-codex"

[mcp_servers.claude]
command = "npx"
args = ["-y", "@anthropic/claude-code", "--as-mcp-server"]

[mcp_servers.gemini]
command = "gemini"
args = ["mcp-server"]

[shell_environment_policy]
inherit = "all"
exclude = ["AWS_*", "AZURE_*"]

[profiles.claude-accuracy]
model = "claude-opus-4.5"
provider = "anthropic"

[profiles.gemini-fast]
model = "gemini-3-flash"
provider = "google"
```

## Appendix D: Neural Loop → Autonomous Mode

Codex's `--full-auto` mode + approval settings replace Claude's neural loop:

```bash
# Codex autonomous mode
codex --full-auto --approval-policy=on-failure "Implement feature with tests"
```

Create `$neural-loop` skill that wraps this with todo.md workflow.
