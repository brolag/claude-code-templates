# Codex Templates

> 1000+ ready-to-use skills, prompts, and configurations for [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)

[![npm version](https://img.shields.io/npm/v/codex-templates.svg)](https://www.npmjs.com/package/codex-templates)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# Install globally
npm install -g codex-templates

# Install a skill
codex-templates install skill code-reviewer

# Use the skill
codex "$code-reviewer"
```

## Features

- **871+ Skills** - SKILL.md bundles that Codex auto-discovers
- **164+ Agent Profiles** - AGENTS.md templates for specialized roles
- **Multi-Model Routing** - Intelligent routing between Codex, Claude, and Gemini
- **Persistent Memory** - Remember facts across sessions
- **Autonomous Loops** - Long-running tasks with iteration control
- **Worktree Manager** - Parallel development with git worktrees

## Component Types

### Skills

Reusable instruction bundles in SKILL.md format. Codex discovers and invokes them automatically.

```bash
# Install a skill
codex-templates install skill memory-persist

# Use it
codex "$memory-persist remember 'User prefers TypeScript'"
codex "$memory-persist recall TypeScript"
```

Popular skills:
- `$code-reviewer` - Expert code review
- `$memory-persist` - Persistent memory across sessions
- `$worktree-manager` - Git worktree management
- `$autonomous-loop` - Long-running autonomous tasks
- `$test-driven-development` - TDD workflow automation

### Agent Profiles

AGENTS.md templates that configure Codex for specific roles:

```bash
# Install an agent profile
codex-templates install agent frontend-developer

# Copy to your project
cp ~/.codex/agents/frontend/frontend-developer/AGENTS.md ./AGENTS.md
```

### Configs

Multi-model configuration profiles:

```bash
# Install a config
codex-templates install config multi-model

# Use profile
codex --profile accuracy   # Route to Claude
codex --profile fast       # Route to Gemini
codex --profile terminal   # Codex strengths
```

### Prompts

Custom prompts for common workflows:

```bash
# Install a prompt
codex-templates install prompt commit

# Access via /prompts: menu
codex  # Then type /prompts:
```

## Multi-Model Collaboration

Codex Templates supports intelligent routing between AI models:

| Model | Strength | Best For |
|-------|----------|----------|
| **GPT-5.1-Codex** | Terminal mastery | DevOps, long sessions, refactors |
| **Claude Opus 4.5** | 80.9% SWE-bench | Architecture, accuracy, planning |
| **Gemini 3 Pro** | 1501 Elo | Algorithms, speed, free tier |

### Configuration

```toml
# ~/.codex/config.toml
model = "gpt-5.1-codex"

[mcp_servers.claude]
command = "npx"
args = ["-y", "@anthropic-ai/claude-code", "--as-mcp-server"]

[profiles.accuracy]
model = "claude-opus-4-5"
provider = "anthropic"

[profiles.fast]
model = "gemini-2.0-flash"
provider = "google"
```

## Core Skills

### Memory Persist

Persistent memory across Codex sessions:

```
$memory-persist remember "User prefers TypeScript over JavaScript"
$memory-persist recall TypeScript
$memory-persist forget fact-abc123
$memory-persist list
```

### Worktree Manager

Parallel development with git worktrees:

```
$worktree-manager new auth-feature
$worktree-manager list
$worktree-manager merge auth-feature
$worktree-manager clean --stale
```

### Autonomous Loop

Long-running autonomous tasks:

```
$autonomous-loop "Implement user auth with tests" --max 30 --promise "AUTH_COMPLETE"
$autonomous-loop status
$autonomous-loop cancel
```

## Installation Options

### Global Installation (Recommended)

```bash
npm install -g codex-templates
```

### Project Initialization

```bash
# In your project directory
codex-templates init

# Creates:
# - AGENTS.md (project instructions)
# - .codex/skills/ (local skills)
```

### With Profile

```bash
codex-templates init --profile accuracy  # Use Claude for accuracy
codex-templates init --profile fast      # Use Gemini for speed
codex-templates init --profile terminal  # Codex terminal mastery
```

## CLI Commands

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

# Search
codex-templates search "code review"

# Initialize project
codex-templates init
codex-templates init --profile accuracy
```

## Directory Structure

```
~/.codex/
├── config.toml              # Main configuration
├── skills/                  # Installed skills
│   ├── memory-persist/
│   │   └── SKILL.md
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── ...
├── prompts/                 # Custom prompts
│   └── commit.md
├── configs/                 # Configuration profiles
│   ├── multi-model.toml
│   └── accuracy.toml
└── memory/                  # Persistent memory
    └── facts/
```

## Creating Custom Skills

Create a SKILL.md file:

```markdown
---
name: my-skill
description: Description for Codex to select this skill
metadata:
  short-description: Brief description
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your skill/prompt/config
4. Submit a pull request

## License

MIT

## Links

- [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)
- [Codex Skills Documentation](https://developers.openai.com/codex/skills/)
- [AGENTS.md Guide](https://developers.openai.com/codex/guides/agents-md/)
- [Discord Community](https://discord.gg/dyTTwzBhwY)

---

Built with ❤️ for the Codex community
