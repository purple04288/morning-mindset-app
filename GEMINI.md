# gStack Configuration for Antigravity

This repository is powered by **gStack-Antigravity** (Y Combinator Garry Tan's AI Engineering Framework ported for Google Antigravity).

## Persona & Guidelines

- **Web Browsing**: Use the `/browse` skill from gstack for all web browsing.
- **Completeness Principle (Boil the Lake)**: Always prefer the complete implementation (handling edge cases, 100% test coverage) over quick shortcuts.
- **Rules Directory**: See [.antigravity/rules/global-gstack.md](file:///.antigravity/rules/global-gstack.md) and [.antigravity/rules/persona-gstack.md](file:///.antigravity/rules/persona-gstack.md).

## Available Skills & Workflows

You can trigger the following gStack personas and skills via slash commands or directly:
- `/office-hours` — YC Partner office hours to pressure-test product scope and framing
- `/plan-ceo-review` — CEO review mode (expansion, selective expansion, hold scope, reduction)
- `/plan-eng-review` — Engineering manager review (architecture, data flow, diagrams, failure modes)
- `/plan-design-review` — Design audit & scoring (rates 0-10, AI slop detection)
- `/design-consultation` — Design partner to build complete design systems from scratch
- `/review` — Staff engineer code review to catch edge-case bugs and race conditions
- `/ship` — Release engineer workflow: sync, run tests, audit coverage, push PR
- `/land-and-deploy` — Merge PR, monitor CI and deploy, verify production health
- `/canary` — Post-deploy monitoring loop (console errors, performance regressions)
- `/benchmark` — Performance profiling (load time, Core Web Vitals)
- `/browse` — Fast headless browser CLI for UI dogfooding and testing
- `/qa` — QA lead to navigate app, locate UI bugs, create atomic fix commits
- `/qa-only` — QA reporter for pure bug reports without code changes
- `/design-review` — Visual design auditor with before/after screenshots
- `/setup-browser-cookies` — Import browser session cookies for authenticated testing
- `/setup-deploy` — Deploy configurator for `/land-and-deploy`
- `/retro` — Weekly engineering retrospective
- `/investigate` — Systematic root-cause debugging (Iron Law: no fixes without investigation)
- `/document-release` — Technical writer to sync README and documentation
- `/codex` — Independent second opinion code review
- `/cso` — Chief Security Officer threat modeling (OWASP Top 10 + STRIDE)
- `/autoplan` — Automated review pipeline (CEO -> Design -> Eng)
- `/careful` — Guardrail mode warning on destructive shell commands
- `/freeze` — Lock code edits to a specific directory
- `/guard` — Maximum safety mode (`/careful` + `/freeze`)
- `/unfreeze` — Unlock directory edit locks
- `/gstack-upgrade` — Self-updater to upgrade gStack to latest release
