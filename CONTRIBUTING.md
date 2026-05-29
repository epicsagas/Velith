# Contributing to Velith

Thank you for your interest in improving Velith! This guide covers how to contribute effectively.

## Quick Links

- [Report a Bug](https://github.com/epicsagas/Velith/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/epicsagas/Velith/issues/new?template=feature_request.md)
- [Open a Discussion](https://github.com/epicsagas/Velith/discussions)

## How to Contribute

### Reporting Issues

1. **Search existing issues** before opening a new one to avoid duplicates.
2. Use the appropriate issue template (Bug Report or Feature Request).
3. For bugs, include:
   - Claude Code version (`claude --version`)
   - Velith command that failed
   - Expected vs. actual behavior
   - Your book's genre and current phase

### Improving Skills

Skills are the core of Velith. Each skill file lives in `skills/Velith/`:

```
skills/Velith/
├── SKILL.md          # Main entry point
├── onboarding.md     # Phase 0
├── ideation.md       # Phase 1
├── outlining.md      # Phase 2
├── drafting.md       # Phase 3
├── editing.md        # Phase 4
├── publishing.md     # Phase 5
├── fiction.md        # Fiction genre patterns
├── nonfiction.md     # Non-fiction genre patterns
└── technical.md      # Technical book patterns
```

When modifying a skill:
- Test with at least one complete book project of the relevant genre
- Verify the phase still transitions correctly to the next phase
- Keep prompts focused — avoid scope creep within a single phase

### Improving Agents

Agents are specialized subagents defined in `agents/`:

- **book-architect** — Structure validation and outline scoring
- **chapter-writer** — Chapter draft generation
- **continuity-editor** — Cross-chapter consistency checks
- **style-doctor** — Voice/tone consistency and AI-slop detection

When modifying an agent:
- Respect the `tools` restriction — each agent has minimal tool access by design
- Test across all three genres (fiction, non-fiction, technical)
- Keep `model` selection appropriate: `haiku` for lightweight tasks, `sonnet` for generation

### Adding a New Genre

1. Create a new skill file: `skills/book-{genre}/SKILL.md`
2. Define genre-specific structure, templates, and validation rules
3. Update `skills/loom/SKILL.md` to include the new genre in the Genre Support table
4. Update `README.md` genre badges and skills table
5. Update `dashboard/src/views/HelpView.svelte` genre arrays and workflow data
6. Test end-to-end with a complete book project

### Pull Request Process

1. Fork the repository and create a feature branch.
2. Make your changes with clear, descriptive commit messages.
3. If changing a skill or agent, document the "why" in the PR description.
4. Ensure your changes don't break existing phase transitions.
5. Submit the PR — a maintainer will review within 48 hours.

### Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(drafting): add parallel chapter generation for technical books
fix(style-doctor): improve AI-slop detection for Korean text
docs(readme): add comparison table
```

## Development Setup

```bash
# Clone the repo
git clone https://github.com/epicsagas/Velith.git

# Install as a local plugin for testing
claude plugin install --local /path/to/velith

# Test changes by running a phase
> /velith
```

## License

By contributing, you agree that your contributions will be licensed under the [Apache-2.0 License](LICENSE).
