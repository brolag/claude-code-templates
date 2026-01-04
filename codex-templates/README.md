# Codex Templates

> 1000+ ready-to-use skills, agent profiles, and configurations for [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)

[![npm version](https://img.shields.io/npm/v/codex-templates.svg)](https://www.npmjs.com/package/codex-templates)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## What is Codex Templates?

Codex Templates is a community-curated collection of skills, agent profiles, and configurations for OpenAI's Codex CLI. It extends Codex with specialized capabilities for code review, memory persistence, autonomous tasks, and multi-model collaboration.

## Quick Start

```bash
# Install the CLI tool
npm install -g codex-templates

# Install a skill
codex-templates install skill code-reviewer

# Use it in Codex
codex "$code-reviewer"
```

## Features

| Feature | Count | Description |
|---------|-------|-------------|
| **Skills** | 871+ | SKILL.md instruction bundles for specialized tasks |
| **Agent Profiles** | 164+ | AGENTS.md templates for developer roles |
| **Configs** | 10+ | Multi-model routing configurations |
| **Prompts** | 50+ | Ready-to-use workflow prompts |

### Key Capabilities

- **Persistent Memory** - Remember facts and preferences across sessions
- **Autonomous Loops** - Long-running tasks with iteration control
- **Worktree Manager** - Parallel development with git worktrees
- **Multi-Model Routing** - Intelligent routing between Codex, Claude, and Gemini

## How Skills Work

Skills are reusable instruction bundles that Codex auto-discovers. When installed, Codex loads the skill's name and description at startup, then reads full instructions when the skill is invoked.

### Invocation Methods

**Explicit:** Use `$skill-name` syntax
```bash
codex "$code-reviewer"
codex "$memory-persist remember 'User prefers TypeScript'"
```

**Implicit:** Codex automatically selects matching skills based on your task description.

### Skill Locations

Skills are discovered in this order (higher = higher priority):

1. `.codex/skills/` - Current directory (repo-scoped)
2. `../.codex/skills/` - Parent directory
3. `$REPO_ROOT/.codex/skills/` - Git repository root
4. `~/.codex/skills/` - User-level (default install location)
5. `/etc/codex/skills/` - System-level
6. Built-in bundled skills

## Installation

### Prerequisites

- [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)
- Node.js 18+

```bash
# Install Codex CLI first
npm i -g @openai/codex

# Install Codex Templates
npm install -g codex-templates
```

### Installing Components

```bash
# Skills
codex-templates install skill memory-persist
codex-templates install skill code-reviewer

# Agent Profiles
codex-templates install agent frontend-developer

# Configurations
codex-templates install config multi-model

# Prompts
codex-templates install prompt commit
```

### Project Initialization

```bash
# In your project directory
codex-templates init

# Creates:
# - AGENTS.md (project instructions)
# - .codex/skills/ (local skills directory)
```

## Core Skills

### memory-persist

Persistent memory across Codex sessions:

```
$memory-persist remember "User prefers TypeScript over JavaScript"
$memory-persist recall TypeScript
$memory-persist forget fact-abc123
$memory-persist list
```

### worktree-manager

Parallel development with git worktrees:

```
$worktree-manager new auth-feature
$worktree-manager list
$worktree-manager merge auth-feature
$worktree-manager clean --stale
```

### autonomous-loop

Long-running autonomous tasks:

```
$autonomous-loop "Implement user auth with tests" --max 30 --promise "AUTH_COMPLETE"
$autonomous-loop status
$autonomous-loop cancel
```

### code-reviewer

Expert code review and analysis:

```
$code-reviewer                    # Review staged changes
$code-reviewer src/auth.ts        # Review specific file
$code-reviewer --security         # Focus on security issues
```

## Agent Profiles (AGENTS.md)

Agent profiles are AGENTS.md templates that configure Codex for specific roles. Codex reads these files before doing any work.

```bash
# Install a profile
codex-templates install agent frontend-developer

# Copy to your project
cp ~/.codex/agents/frontend-developer/AGENTS.md ./AGENTS.md
```

### Discovery Order

Codex discovers AGENTS.md files in this order:

1. **Global scope:** `~/.codex/AGENTS.md`
2. **Project scope:** From repo root down to current directory

Files closer to your working directory take precedence.

## Multi-Model Collaboration

Codex Templates supports intelligent routing between AI models:

| Model | Strength | Best For |
|-------|----------|----------|
| **GPT-5-Codex** | Terminal mastery | DevOps, long sessions, refactors |
| **Claude Opus 4.5** | 80.9% SWE-bench | Architecture, accuracy, planning |
| **Gemini 3 Pro** | 1501 Elo algorithms | Speed, free tier, algorithms |

### Configuration

Install the multi-model config:

```bash
codex-templates install config multi-model
```

This creates `~/.codex/config.toml`:

```toml
model = "gpt-5-codex"
approval_policy = "untrusted"

# Claude via MCP
[mcp_servers.claude]
command = "npx"
args = ["-y", "@anthropic-ai/claude-code", "--as-mcp-server"]

# Model profiles
[profiles.accuracy]
model = "claude-opus-4-5"
model_provider = "anthropic"

[profiles.fast]
model = "gemini-2.0-flash"
model_provider = "google"
```

### Using Profiles

```bash
codex --profile accuracy   # Route to Claude for architecture
codex --profile fast       # Route to Gemini for speed
```

## CLI Reference

```bash
# Install components
codex-templates install skill <name>
codex-templates install prompt <name>
codex-templates install config <name>
codex-templates install agent <name>

# List available components
codex-templates list                  # All types
codex-templates list skills           # Skills only
codex-templates list --category dev   # Filter by category

# Search components
codex-templates search "code review"

# Initialize project
codex-templates init
codex-templates init --profile accuracy
```

## Directory Structure

After installation:

```
~/.codex/
├── config.toml              # Main configuration
├── AGENTS.md                # Global agent instructions
├── skills/                  # Installed skills
│   ├── memory-persist/
│   │   └── SKILL.md
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── ...
├── prompts/                 # Custom prompts
├── configs/                 # Configuration profiles
└── memory/                  # Persistent memory storage
    └── facts/
```

## Creating Custom Skills

Create a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: my-skill
description: Description that helps Codex select this skill
metadata:
  short-description: Brief user-facing description
  category: development
---

# My Skill

Instructions for Codex to follow when this skill is invoked.

## Usage

Invoke with `$my-skill [arguments]`

## Scripts (optional)

### scripts/run.sh
\`\`\`bash
#!/bin/bash
echo "Running my skill"
\`\`\`
```

Install in `~/.codex/skills/my-skill/SKILL.md`

## Skill Format Reference

Skills follow the [Open Agent Skills Standard](https://agentskills.io/specification):

```
my-skill/
├── SKILL.md           # Required: instructions + metadata
├── scripts/           # Optional: executable code
├── references/        # Optional: documentation
└── assets/            # Optional: templates, resources
```

### Required Frontmatter

| Field | Description |
|-------|-------------|
| `name` | Skill identifier (kebab-case) |
| `description` | Selection context for Codex |

### Optional Frontmatter

| Field | Description |
|-------|-------------|
| `metadata.short-description` | Brief user-facing description |
| `metadata.category` | Skill category (development, productivity, etc.) |

## Troubleshooting

### Skill Not Found

1. Verify file is named exactly `SKILL.md`
2. Check skill is in a supported path (`~/.codex/skills/`)
3. Restart Codex after installing new skills
4. Ensure YAML frontmatter is valid (no tabs, proper indentation)

### Config Not Loading

1. Verify `~/.codex/config.toml` exists
2. Check TOML syntax is valid
3. Restart Codex after config changes

### MCP Server Connection Issues

1. Ensure the MCP server command is installed
2. Check `startup_timeout_sec` in config (default: 10s)
3. Verify network access for HTTP-based servers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your skill/prompt/config to `codex-templates/skills/`
4. Submit a pull request

### Skill Guidelines

- Use descriptive, kebab-case names
- Write clear descriptions for Codex selection
- Include usage examples in the SKILL.md
- Add optional scripts for complex workflows

## License

MIT

## Links

- [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)
- [Codex Skills Documentation](https://developers.openai.com/codex/skills/)
- [AGENTS.md Guide](https://developers.openai.com/codex/guides/agents-md/)
- [Configuration Reference](https://developers.openai.com/codex/config-reference/)
- [Model Context Protocol](https://developers.openai.com/codex/mcp/)
- [Open Agent Skills Standard](https://agentskills.io/specification)
- [Discord Community](https://discord.gg/dyTTwzBhwY)

---

Built with love for the Codex community

**Ported from [Claude Code Templates](https://github.com/anthropics/claude-code-templates)** - The original 1400+ component library for Claude Code.
