# Codex Templates - Global Configuration

This AGENTS.md provides global instructions for Codex when working with codex-templates.

## Project Overview

Codex Templates is a collection of 1000+ reusable skills, prompts, agents, and configurations for OpenAI Codex CLI. It supports multi-model collaboration with Claude and Gemini.

## Available Skills

Skills extend Codex with specialized capabilities. Invoke with `$skill-name`:

### Development
- `$code-reviewer` - Expert code review for quality and security
- `$test-driven-development` - TDD workflow automation
- `$debugger` - Systematic debugging specialist
- `$refactor-expert` - Safe code refactoring

### Productivity
- `$memory-persist` - Persistent memory across sessions
- `$worktree-manager` - Git worktree management
- `$autonomous-loop` - Long autonomous task execution

### Multi-AI Collaboration
- `$claude-handoff` - Delegate accuracy-critical tasks to Claude
- `$gemini-algorithm` - Delegate algorithmic tasks to Gemini

## Commands

| Command | Description |
|---------|-------------|
| `$skill-installer <name>` | Install a skill from the catalog |
| `$memory-persist remember <fact>` | Save a fact to memory |
| `$memory-persist recall <query>` | Search memory |
| `$worktree-manager new <name>` | Create git worktree |
| `$autonomous-loop "<task>"` | Start autonomous iteration |

## Multi-Model Routing

This project supports intelligent routing between models:

| Model | Strength | Use Case |
|-------|----------|----------|
| GPT-5.1-Codex | Terminal mastery, long sessions | DevOps, refactors |
| Claude Opus 4.5 | 80.9% SWE-bench accuracy | Architecture, complex logic |
| Gemini 3 Pro | 1501 Elo algorithms | Competitive coding, speed |

Switch profiles:
```bash
codex --profile accuracy   # Use Claude
codex --profile fast       # Use Gemini
codex --profile terminal   # Use Codex strengths
codex --profile autonomous # Long sessions
```

## Best Practices

1. **Use skills for repeatable tasks** - Don't reinvent workflows
2. **Let Codex auto-select skills** - Describe your task naturally
3. **Use profiles for model routing** - Match model to task type
4. **Keep AGENTS.md updated** - Project context improves results

## Safety

- Never store secrets in skills or AGENTS.md
- Use `approval_policy = "untrusted"` for sensitive operations
- Review generated code before committing

---

*Codex Templates v1.0.0*
*Multi-model AI development system*
