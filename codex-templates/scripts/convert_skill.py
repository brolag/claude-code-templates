#!/usr/bin/env python3
"""
Convert Claude Code skill/agent format to Codex SKILL.md format.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, Optional, Tuple

def parse_claude_frontmatter(content: str) -> Tuple[Dict, str]:
    """Parse YAML-like frontmatter from Claude skill/agent files."""
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

def convert_to_skill_md(name: str, frontmatter: Dict, body: str, category: str) -> str:
    """Convert to Codex SKILL.md format."""

    # Extract description
    description = frontmatter.get('description', f'{name} skill')

    # Build SKILL.md content
    skill_content = f"""---
name: {name}
description: {description}
metadata:
  short-description: {description[:100]}
  category: {category}
  source: claude-code-templates
---

# {name.replace('-', ' ').title()}

{body}

## Usage

Invoke this skill with:
```
${name} [arguments]
```

Or let Codex auto-select based on your prompt.
"""

    return skill_content

def convert_claude_agent(source_path: Path, dest_dir: Path, category: str) -> Optional[Path]:
    """Convert a Claude agent/skill file to Codex SKILL.md format."""

    content = source_path.read_text()
    frontmatter, body = parse_claude_frontmatter(content)

    name = frontmatter.get('name', source_path.stem)

    # Create skill directory
    skill_dir = dest_dir / category / name
    skill_dir.mkdir(parents=True, exist_ok=True)

    # Convert to SKILL.md
    skill_content = convert_to_skill_md(name, frontmatter, body, category)

    skill_file = skill_dir / 'SKILL.md'
    skill_file.write_text(skill_content)

    return skill_file

def convert_claude_command(source_path: Path, dest_dir: Path, category: str) -> Optional[Path]:
    """Convert a Claude command to Codex prompt format."""

    content = source_path.read_text()
    frontmatter, body = parse_claude_frontmatter(content)

    name = frontmatter.get('name', source_path.stem)
    description = frontmatter.get('description', f'{name} command')

    # Create prompt file
    prompt_dir = dest_dir / category
    prompt_dir.mkdir(parents=True, exist_ok=True)

    prompt_content = f"""# {name}

{description}

## Prompt

{body}
"""

    prompt_file = prompt_dir / f'{name}.md'
    prompt_file.write_text(prompt_content)

    return prompt_file

def batch_convert_skills(source_dir: Path, dest_dir: Path) -> int:
    """Convert all skills from source to destination."""
    converted = 0

    # Map source categories to Codex categories
    category_map = {
        'development': 'development',
        'development-tools': 'development',
        'development-team': 'development',
        'productivity': 'productivity',
        'scientific': 'scientific',
        'utilities': 'utilities',
        'enterprise-communication': 'enterprise',
        'creative-design': 'creative',
        'business-marketing': 'enterprise',
        'data-ai': 'development',
        'database': 'development',
        'devops-infrastructure': 'development',
        'security': 'development',
        'documentation': 'productivity',
    }

    for source_file in source_dir.rglob('*.md'):
        if source_file.name.startswith('_') or 'ATTRIBUTION' in source_file.name:
            continue

        # Determine category
        parent = source_file.parent.name
        category = category_map.get(parent, 'utilities')

        try:
            result = convert_claude_agent(source_file, dest_dir, category)
            if result:
                converted += 1
                print(f"Converted: {source_file.name} -> {result}")
        except Exception as e:
            print(f"Error converting {source_file}: {e}")

    return converted

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python convert_skill.py <source_dir> <dest_dir>")
        print("  --dry-run  Only show what would be converted")
        sys.exit(1)

    source = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    dry_run = '--dry-run' in sys.argv

    if dry_run:
        print(f"Would convert skills from {source} to {dest}")
        count = len(list(source.rglob('*.md')))
        print(f"Found {count} potential files")
    else:
        count = batch_convert_skills(source, dest)
        print(f"\nConverted {count} skills")
