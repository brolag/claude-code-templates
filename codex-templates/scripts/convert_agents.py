#!/usr/bin/env python3
"""
Convert Claude Code agents to Codex AGENTS.md format.
"""

import os
import re
import sys
from pathlib import Path
from typing import Dict, Tuple

def parse_frontmatter(content: str) -> Tuple[Dict, str]:
    """Parse YAML-like frontmatter."""
    frontmatter = {}
    body = content

    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            fm_content = parts[1].strip()
            body = parts[2].strip()

            for line in fm_content.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip()

    return frontmatter, body

def convert_to_agents_md(name: str, frontmatter: Dict, body: str) -> str:
    """Convert to Codex AGENTS.md format."""
    description = frontmatter.get('description', f'{name} specialist')
    tools = frontmatter.get('tools', 'Read, Write, Edit, Bash')
    model = frontmatter.get('model', 'gpt-5.1-codex')

    # Map Claude models to Codex
    model_map = {
        'sonnet': 'gpt-5.1-codex',
        'opus': 'gpt-5.1-codex-max',
        'haiku': 'gpt-4o-mini',
    }
    codex_model = model_map.get(model, model)

    agents_content = f"""# {name.replace('-', ' ').title()}

{description}

## Role

{body}

## Configuration

**Recommended Model**: {codex_model}
**Tools Available**: {tools}

## Usage

To use this agent profile, either:

1. Copy this file to your project as `AGENTS.md`
2. Or use the skill: `$agent-{name}`
3. Or set as config profile: `codex --profile {name}`

## Best Practices

- Focus on the specialized domain described above
- Use the recommended model for optimal results
- Combine with other agent profiles for complex tasks

---

*Generated from claude-code-templates*
"""

    return agents_content

def convert_agents(source_dir: Path, dest_dir: Path) -> int:
    """Convert all agents from source to destination."""
    converted = 0

    # Category mapping
    category_map = {
        'development-team': 'frontend',
        'development-tools': 'frontend',
        'devops-infrastructure': 'devops',
        'security': 'security',
        'data-ai': 'data-ai',
        'database': 'backend',
        'documentation': 'frontend',
        'expert-advisors': 'backend',
    }

    for source_file in source_dir.rglob('*.md'):
        if source_file.name.startswith('_') or 'overview' in source_file.name.lower():
            continue

        content = source_file.read_text()
        frontmatter, body = parse_frontmatter(content)

        name = frontmatter.get('name', source_file.stem)
        parent = source_file.parent.name
        category = category_map.get(parent, 'frontend')

        # Create agent directory
        agent_dir = dest_dir / category / name
        agent_dir.mkdir(parents=True, exist_ok=True)

        # Convert to AGENTS.md
        agents_content = convert_to_agents_md(name, frontmatter, body)

        agents_file = agent_dir / 'AGENTS.md'
        agents_file.write_text(agents_content)

        converted += 1
        print(f"Converted: {source_file.name} -> {agents_file}")

    return converted

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python convert_agents.py <source_dir> <dest_dir>")
        sys.exit(1)

    source = Path(sys.argv[1])
    dest = Path(sys.argv[2])

    count = convert_agents(source, dest)
    print(f"\nConverted {count} agents")
