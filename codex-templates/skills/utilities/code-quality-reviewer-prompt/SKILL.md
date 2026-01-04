---
name: code-quality-reviewer-prompt
description: code-quality-reviewer-prompt skill
metadata:
  short-description: code-quality-reviewer-prompt skill
  category: utilities
  source: claude-code-templates
---

# Code Quality Reviewer Prompt

# Code Quality Reviewer Prompt Template

Use this template when dispatching a code quality reviewer subagent.

**Purpose:** Verify implementation is well-built (clean, tested, maintainable)

**Only dispatch after spec compliance review passes.**

```
Task tool (superpowers:code-reviewer):
  Use template at requesting-code-review/code-reviewer.md

  WHAT_WAS_IMPLEMENTED: [from implementer's report]
  PLAN_OR_REQUIREMENTS: Task N from [plan-file]
  BASE_SHA: [commit before task]
  HEAD_SHA: [current commit]
  DESCRIPTION: [task summary]
```

**Code reviewer returns:** Strengths, Issues (Critical/Important/Minor), Assessment


## Usage

Invoke this skill with:
```
$code-quality-reviewer-prompt [arguments]
```

Or let Codex auto-select based on your prompt.
