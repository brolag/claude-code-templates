---
name: memory-persist
description: Persistent memory system across Codex sessions. Use when you need to remember facts, recall information, or maintain context between sessions.
metadata:
  short-description: Remember and recall facts across sessions
  category: productivity
  source: neural-claude-code
---

# Memory Persist

Manage persistent memory across Codex sessions using JSON files.

## Usage

```
$memory-persist remember "User prefers TypeScript over JavaScript"
$memory-persist recall "TypeScript"
$memory-persist forget "fact-abc123"
$memory-persist list
```

## Memory Tiers

### Hot Memory (Session)
- Current conversation context
- Loaded at session start

### Warm Memory (Files)
- Facts: `~/.codex/memory/facts/*.json`
- Events: `~/.codex/memory/events/{date}.jsonl`
- Quick access (seconds)

### Cold Memory (Archives)
- AGENTS.md files
- Session archives
- Historical patterns

## Commands

### remember <fact>
Save a fact to persistent memory.

**Process**:
1. Parse the fact content
2. Generate unique ID (fact-{uuid})
3. Categorize (preference, pattern, learning, context)
4. Write to `~/.codex/memory/facts/`
5. Update active context if relevant

**Fact Schema**:
```json
{
  "id": "fact-abc12345",
  "timestamp": "2026-01-04T12:00:00Z",
  "category": "preference",
  "content": "The fact to remember",
  "source": "user",
  "confidence": 1.0,
  "access_count": 0
}
```

### recall <query>
Search memory for relevant information.

**Process**:
1. Search facts by keyword match
2. Search events for context
3. Check AGENTS.md files
4. Return ranked results by relevance and access count

### forget <fact-id>
Remove information from memory.

**Process**:
1. Find matching fact by ID or content
2. Archive to `~/.codex/memory/archives/`
3. Remove from active facts

### list
Show all stored facts with categories.

## Scripts

### scripts/memory_write.py
```python
#!/usr/bin/env python3
import json
import sys
import uuid
from datetime import datetime
from pathlib import Path

def write_fact(content, category="learning"):
    memory_dir = Path.home() / ".codex" / "memory" / "facts"
    memory_dir.mkdir(parents=True, exist_ok=True)

    fact = {
        "id": f"fact-{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "category": category,
        "content": content,
        "source": "user",
        "confidence": 1.0,
        "access_count": 0
    }

    fact_file = memory_dir / f"{fact['id']}.json"
    fact_file.write_text(json.dumps(fact, indent=2))
    print(f"Saved: {fact['id']}")
    return fact

if __name__ == "__main__":
    content = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else ""
    if content:
        write_fact(content)
    else:
        print("Usage: memory_write.py <fact content>")
```

### scripts/memory_read.py
```python
#!/usr/bin/env python3
import json
import sys
from pathlib import Path

def read_memory(query=""):
    memory_dir = Path.home() / ".codex" / "memory" / "facts"
    if not memory_dir.exists():
        return []

    results = []
    for fact_file in memory_dir.glob("*.json"):
        try:
            fact = json.loads(fact_file.read_text())
            if not query or query.lower() in fact["content"].lower():
                results.append(fact)
        except:
            continue

    return sorted(results, key=lambda x: x.get("access_count", 0), reverse=True)

if __name__ == "__main__":
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else ""
    results = read_memory(query)

    if results:
        for fact in results[:10]:
            print(f"[{fact['id']}] ({fact['category']}) {fact['content']}")
    else:
        print("No facts found" + (f" matching '{query}'" if query else ""))
```

## Integration

This skill automatically loads facts at session start when you have a `~/.codex/AGENTS.md` that references it.

Add to your global AGENTS.md:
```markdown
## Memory
Use $memory-persist to remember important facts across sessions.
Check memory before making assumptions about user preferences.
```

## Safety

- Never store passwords, API keys, or secrets
- Validate JSON before writing
- Archive instead of delete
