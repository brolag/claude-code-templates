---
name: autonomous-loop
description: Long autonomous task execution with iteration control. Use for multi-hour refactors, TDD workflows, batch operations, or any task requiring sustained autonomous work.
metadata:
  short-description: Autonomous iteration until task completion
  category: productivity
  source: neural-claude-code
---

# Autonomous Loop

Execute long-running autonomous tasks with iteration control and completion detection.

## Why Autonomous Loop

- **Multi-hour sessions**: Work on complex tasks for extended periods
- **TDD workflows**: Write tests, implement, iterate until green
- **Batch operations**: Process large codebases systematically
- **Self-correcting**: Re-attempt on failures until success

## Usage

```
$autonomous-loop "<task description>" [--max <n>] [--promise "<text>"]
$autonomous-loop status
$autonomous-loop cancel
```

## Commands

### Start Loop
```
$autonomous-loop "Implement user authentication with tests" --max 30 --promise "AUTH_COMPLETE"
```

**Arguments**:
- `task description` - What to accomplish (required)
- `--max <n>` - Maximum iterations (default: 20)
- `--promise "<text>"` - Completion phrase (default: LOOP_COMPLETE)

### status
Check current loop state.

### cancel
Stop the active loop.

## How It Works

1. **Initialize**: Create todo.md with task breakdown
2. **Execute**: Work on tasks autonomously
3. **Validate**: Run tests/checks after each iteration
4. **Iterate**: Continue if validation fails
5. **Complete**: Output promise phrase when done

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   START     │ ──▶ │   EXECUTE   │ ──▶ │  VALIDATE   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                           ┌───────────────────┴───────────────────┐
                           │                                       │
                           ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │   PASS      │                         │   FAIL      │
                    │  (Complete) │                         │  (Iterate)  │
                    └─────────────┘                         └──────┬──────┘
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │   EXECUTE   │
                                                            └─────────────┘
```

## Codex Integration

This skill leverages Codex's native autonomous mode:

```bash
# Full autonomous mode
codex --full-auto --approval-policy=on-failure "<task>"

# With this skill, you get:
# - Structured todo.md tracking
# - Iteration counting
# - Completion promise detection
# - Test validation integration
```

## Scripts

### scripts/loop-start.sh
```bash
#!/bin/bash
TASK="$1"
MAX="${2:-20}"
PROMISE="${3:-LOOP_COMPLETE}"

# Create loop state file
LOOP_FILE="$HOME/.codex/loop-state.json"
mkdir -p "$(dirname "$LOOP_FILE")"

cat > "$LOOP_FILE" << EOF
{
  "task": "$TASK",
  "max_iterations": $MAX,
  "current_iteration": 0,
  "promise": "$PROMISE",
  "status": "running",
  "started": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "Autonomous Loop Started"
echo ""
echo "Task: $TASK"
echo "Max iterations: $MAX"
echo "Completion promise: $PROMISE"
echo ""
echo "Loop continues until you output '$PROMISE' or reach $MAX iterations."
echo "Use '\$autonomous-loop cancel' to stop manually."
```

### scripts/loop-status.sh
```bash
#!/bin/bash
LOOP_FILE="$HOME/.codex/loop-state.json"

if [ ! -f "$LOOP_FILE" ]; then
    echo "No active loop"
    exit 0
fi

cat "$LOOP_FILE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(f\"Status: {data['status']}\")
print(f\"Task: {data['task']}\")
print(f\"Iteration: {data['current_iteration']}/{data['max_iterations']}\")
print(f\"Promise: {data['promise']}\")
print(f\"Started: {data['started']}\")
"
```

### scripts/loop-cancel.sh
```bash
#!/bin/bash
LOOP_FILE="$HOME/.codex/loop-state.json"

if [ ! -f "$LOOP_FILE" ]; then
    echo "No active loop to cancel"
    exit 0
fi

# Update status
python3 -c "
import json
with open('$LOOP_FILE', 'r') as f:
    data = json.load(f)
data['status'] = 'cancelled'
with open('$LOOP_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"

echo "Loop cancelled"
```

## Best Practices

### Task Definition
- **Be specific**: "Implement JWT auth with refresh tokens" not "Add auth"
- **Include validation**: "...and ensure all tests pass"
- **Set realistic max**: Start with 10-20, increase as needed

### Todo.md Structure
Create structured tasks for tracking:

```markdown
# Task: Implement user authentication

## Success Criteria
- [ ] JWT token generation works
- [ ] Refresh token rotation works
- [ ] All tests pass: `npm test`

## Phase 1: Setup
- [ ] Install dependencies
- [ ] Create auth middleware

## Phase 2: Implementation
- [ ] Implement login endpoint
- [ ] Implement refresh endpoint
- [ ] Add route protection

## Phase 3: Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Run full test suite

EXIT: LOOP_COMPLETE when all criteria pass
```

### Validation Commands
Include testable validation:

```markdown
### Validation
- [ ] Run: `npm test` - expect 0 failures
- [ ] Run: `npm run typecheck` - expect no errors
- [ ] Run: `curl localhost:3000/api/health` - expect 200
```

## Examples

### TDD Workflow
```
$autonomous-loop "Implement calculator with TDD: write failing test, implement, refactor, repeat until 100% coverage" --max 15 --promise "TDD_COMPLETE"
```

### Large Refactor
```
$autonomous-loop "Migrate all class components to functional with hooks, ensure tests pass after each file" --max 40 --promise "MIGRATION_COMPLETE"
```

### Bug Hunt
```
$autonomous-loop "Find and fix the memory leak in the rendering pipeline, verify with profiler" --max 10 --promise "LEAK_FIXED"
```

## Safety

- Set reasonable max iterations (start low)
- Include validation commands
- Use `--approval-policy=on-failure` for risky operations
- Monitor progress with `$autonomous-loop status`
- Cancel immediately if something goes wrong
