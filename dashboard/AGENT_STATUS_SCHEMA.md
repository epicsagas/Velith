# Agent Status Schema

Agents record their status in `$HOME/.velith/agents/{id}.json` upon execution.
The `/book-status` command scans this directory and merges the statuses into `$HOME/.velith/status.json`.

## Directory Structure

```
$HOME/.velith/
├── status.json              # Aggregate status (written by book-status, read by dashboard)
├── agents/
│   ├── book-architect.json
│   ├── chapter-writer.json
│   ├── continuity-editor.json
│   ├── cover-designer.json
│   ├── marketing-expert.json
│   ├── scene-generator.json
│   └── style-doctor.json
└── logs/                    # Logs to be stored in the future
```

## Agent Status File Schema

One agent per file. A single object, not an array.

```json
{
  "status": "running",
  "last_run": "2026-05-16T11:30:00Z",
  "task": "Generating draft for ch03-core.md"
}
```

### Fields

| Field | Type | Description |
|------|------|------|
| `status` | `'idle' \| 'running' \| 'complete' \| 'error'` | Current execution state |
| `last_run` | string (ISO 8601) \| null | Last run time |
| `task` | string \| null | Current task being performed. `null` if none. |

## Agent ID → File Mapping

| File Name | Agent |
|--------|---------|
| `book-architect.json` | Book Architect |
| `chapter-writer.json` | Chapter Writer |
| `continuity-editor.json` | Continuity Editor |
| `cover-designer.json` | Cover Designer |
| `marketing-expert.json` | Marketing Expert |
| `scene-generator.json` | Scene Generator |
| `style-doctor.json` | Style Doctor |

## Agent Writing Patterns

```bash
# On execution start
mkdir -p "$HOME/.velith/agents"
echo '{"status":"running","last_run":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","task":"Task description"}' \
  > "$HOME/.velith/agents/{id}.json"

# On completion
echo '{"status":"complete","last_run":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","task":null}' \
  > "$HOME/.velith/agents/{id}.json"

# On error
echo '{"status":"error","last_run":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'","task":"Error: description"}' \
  > "$HOME/.velith/agents/{id}.json"
```
