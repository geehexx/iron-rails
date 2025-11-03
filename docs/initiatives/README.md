# Project Initiatives

This directory tracks multi-session work efforts for the Iron Rails project. Initiatives are larger bodies of work that span multiple days or weeks and require coordination across multiple commits and sessions.

## What is an Initiative?

An **initiative** is a planned, goal-oriented work effort that:

- Spans multiple work sessions
- Has clear, measurable success criteria
- Requires multiple commits and potentially multiple phases
- Addresses significant improvements or features
- Needs proper planning, tracking, and documentation

## Initiative Lifecycle

```text
Proposed → Active → Complete
             ↓
          Deferred
```

### 1. Proposed

- Created in `active/` directory with status "Proposed".
- Awaiting approval or prioritization.

### 2. Active

- Status changed to "Active".
- Work is in progress.

### 3. Complete

- All success criteria met.
- Status changed to "Complete".
- Moved to `completed/` directory.

### 4. Deferred

- Captures scoped work that is intentionally paused.
- Lives in `deferred/`.

## Directory Structure

```text
docs/initiatives/
├── README.md               # This file
├── template.md             # The template for a new initiative file.
├── template/               # A directory containing the template and other assets.
├── active/                 # In-progress initiatives.
├── deferred/               # Approved but paused initiatives.
└── completed/              # Successfully finished initiatives.
```

## Creating a New Initiative

1. **Copy the Template:** Make a copy of `docs/initiatives/template.md` into the `docs/initiatives/active/` directory.
2. **Name the File:** Use the format `YYYYMMDD-brief-description.md` (e.g., `20251102-gdd-v1-foundation.md`).
3. **Fill it Out:** Complete all the sections in the new initiative file.
4. **Commit:** Add the new file to version control.

## Best Practices

- **DO** break down work into phases.
- **DO** make success criteria measurable.
- **DO** update the initiative document regularly.
- **DO** link to related documents.
- **DON'T** create initiatives for small, single-commit tasks.
- **DON'T** leave initiatives in an outdated state.
