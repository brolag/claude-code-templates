---
name: worktree-manager
description: Create, manage, and merge git worktrees for parallel development. Use when starting parallel features, running multiple Codex instances, or for isolated development.
metadata:
  short-description: Git worktree management for parallel development
  category: productivity
  source: neural-claude-code
---

# Worktree Manager

Manage git worktrees for parallel Codex development sessions.

## Why Worktrees

- **Isolation**: Each worktree is a separate working directory
- **Parallelism**: Multiple Codex instances can work simultaneously
- **Clean Integration**: Feature branches merge cleanly to main
- **No Conflicts**: Work on multiple features without stashing

## Usage

```
$worktree-manager new <feature-name>
$worktree-manager list
$worktree-manager status <name>
$worktree-manager merge <name>
$worktree-manager clean <name>
$worktree-manager clean --stale
```

## Commands

### new <feature-name>
Create a new worktree for a feature.

**Process**:
1. Validate feature name (kebab-case only)
2. Create branch: `git branch feature/<name>`
3. Create worktree: `git worktree add ../worktrees/<name> feature/<name>`
4. Initialize minimal .codex/ structure
5. Output activation instructions

**Example**:
```
$worktree-manager new auth-system

# Output:
Created worktree at: ../worktrees/auth-system
Branch: feature/auth-system
To start: cd ../worktrees/auth-system && codex
```

### list
List all active worktrees with status.

Shows:
- Worktree path
- Branch name
- Commit status (ahead/behind main)
- Uncommitted changes

### status <name>
Show detailed status of a specific worktree.

### merge <name>
Merge worktree branch back to main.

**Process**:
1. Check for uncommitted changes (abort if found)
2. Checkout main branch
3. Merge with `--no-ff` for clean history
4. Suggest cleanup command

### clean <name>
Remove worktree and optionally delete branch.

**Options**:
- `--stale`: Clean all merged worktrees
- `--force`: Force removal even with uncommitted changes

## Scripts

### scripts/wt-new.sh
```bash
#!/bin/bash
set -e

FEATURE="$1"
BASE_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PARENT_DIR=$(dirname "$BASE_DIR")
WT_DIR="$PARENT_DIR/worktrees/$FEATURE"

# Validate name
if [[ ! "$FEATURE" =~ ^[a-z0-9-]+$ ]]; then
    echo "Error: Feature name must be kebab-case (lowercase, hyphens only)"
    exit 1
fi

# Check if already exists
if [ -d "$WT_DIR" ]; then
    echo "Error: Worktree already exists at $WT_DIR"
    exit 1
fi

# Create branch and worktree
git branch "feature/$FEATURE" 2>/dev/null || true
git worktree add "$WT_DIR" "feature/$FEATURE"

# Initialize minimal .codex structure
mkdir -p "$WT_DIR/.codex"
cat > "$WT_DIR/.codex/AGENTS.md" << EOF
# Worktree: $FEATURE

Created: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Parent: $BASE_DIR

## Focus
Working on feature/$FEATURE

## Notes
- This is an isolated worktree for parallel development
- Merge back with: cd $BASE_DIR && git merge feature/$FEATURE
EOF

echo ""
echo "Created worktree at: $WT_DIR"
echo "Branch: feature/$FEATURE"
echo ""
echo "To start working:"
echo "  cd $WT_DIR && codex"
```

### scripts/wt-list.sh
```bash
#!/bin/bash
echo "=== Active Worktrees ==="
echo ""
git worktree list --porcelain | while read line; do
    if [[ "$line" == "worktree "* ]]; then
        path="${line#worktree }"
        echo "Path: $path"
    elif [[ "$line" == "branch "* ]]; then
        branch="${line#branch refs/heads/}"
        echo "Branch: $branch"

        # Check for uncommitted changes
        if [ -d "$path" ]; then
            changes=$(cd "$path" && git status --porcelain 2>/dev/null | wc -l)
            if [ "$changes" -gt 0 ]; then
                echo "Status: $changes uncommitted changes"
            else
                echo "Status: Clean"
            fi
        fi
        echo ""
    fi
done
```

### scripts/wt-merge.sh
```bash
#!/bin/bash
set -e

FEATURE="$1"
BASE_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PARENT_DIR=$(dirname "$BASE_DIR")
WT_DIR="$PARENT_DIR/worktrees/$FEATURE"

if [ ! -d "$WT_DIR" ]; then
    echo "Error: Worktree not found: $FEATURE"
    exit 1
fi

# Check for uncommitted changes
cd "$WT_DIR"
if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Uncommitted changes in worktree"
    echo "Commit or stash changes before merging"
    exit 1
fi

# Return to main repo and merge
cd "$BASE_DIR"
git checkout main
git merge "feature/$FEATURE" --no-ff -m "Merge feature/$FEATURE"

echo ""
echo "Merged feature/$FEATURE into main"
echo "Run '\$worktree-manager clean $FEATURE' to remove the worktree"
```

## Multi-Agent Pattern

For complex tasks, spawn specialized Codex instances in separate worktrees:

```bash
# Create specialized worktrees
$worktree-manager new backend-api
$worktree-manager new frontend-ui
$worktree-manager new integration-tests

# Launch Codex in each (separate terminals)
cd ../worktrees/backend-api && codex "Implement REST API for users"
cd ../worktrees/frontend-ui && codex "Build React components for user management"
cd ../worktrees/integration-tests && codex "Write E2E tests for user workflows"

# Merge in sequence when complete
$worktree-manager merge backend-api
$worktree-manager merge frontend-ui
$worktree-manager merge integration-tests

# Cleanup
$worktree-manager clean --stale
```

## Safety

- Never create worktrees inside existing worktrees
- Always check for uncommitted changes before operations
- Validate feature names (kebab-case only)
- Use `--stale` cleanup regularly to prevent accumulation
