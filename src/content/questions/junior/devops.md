---
defaultDomains:
- data-infra
defaultTopics:
- devops
questions:
- q: Which practice is most fundamental for effective continuous integration in a large project?
  options:
  - text: Keep code in single source repository and automate build and test on each change
    correct: true
  - text: Deploy to a staging environment on every merge to validate integration early
    correct: false
  - text: Require all changes to pass peer review before triggering any automated build
    correct: false
  - text: Enforce branch-per-feature policies with automated merge trains to prevent conflicts
    correct: false
  explanation: CI depends on shared source of truth plus automated verification on change. Staging deployment on every merge
    is CD, not CI. Requiring review before builds slows the feedback loop CI is designed to shorten. Merge trains and feature
    branches are workflow conventions, not the foundation of CI itself. In large systems, reliability starts with repeatable
    automation tied to version control.
  difficulty: junior
- q: What is main benefit of storing CI configuration and scripts in version control?
  options:
  - text: Pipeline behavior becomes reviewable, reproducible, and auditable
    correct: true
  - text: It decouples pipeline definitions from the runtime environment for portability
    correct: false
  - text: It allows pipeline agents to self-update configuration without admin intervention
    correct: false
  - text: It encrypts secrets alongside build scripts for centralized credential management
    correct: false
  explanation: Versioning CI config gives history, peer review, rollback, and shared visibility. Decoupling from runtime is
    a nice property but not the main benefit. Self-updating agents and secret management are unrelated concerns that version
    control does not address. In production, pipeline changes are code and should be treated like code.
  difficulty: junior
- q: Which approach best supports scalable and repeatable infrastructure automation?
  options:
  - text: Define infrastructure as code with reusable modules and idempotent automation
    correct: true
  - text: Use configuration management tools to apply settings to existing servers after provisioning
    correct: false
  - text: Build golden VM images for each environment to enforce environment parity
    correct: false
  - text: Automate provisioning and handle configuration changes manually to limit blast radius
    correct: false
  explanation: Scalable infrastructure automation depends on declarative or scripted IaC, modularity, and repeatability. Configuration
    management tools are complementary but apply to existing infrastructure, not a substitute for IaC. Golden images help
    immutable infrastructure patterns but do not cover all infrastructure types. Manual configuration changes reintroduce
    drift. In growing systems, repeatable provisioning is non-negotiable.
  difficulty: junior
- q: How does Infrastructure as Code improve collaboration inside DevOps teams?
  options:
  - text: Infrastructure changes become reviewable, reusable, versioned, and less prone to configuration drift
    correct: true
  - text: It generates infrastructure documentation automatically from resource definitions
    correct: false
  - text: It reduces the need for environment-specific configuration by abstracting provider differences
    correct: false
  - text: It enforces a single cloud provider so teams avoid splitting expertise across tools
    correct: false
  explanation: IaC turns infrastructure into shared code artifacts that teams can review, reuse, and evolve together. Documentation
    generation depends on tooling choices and is not a core collaboration benefit. Abstracting provider differences is a goal
    of some frameworks but is separate from collaboration. Provider lock-in is a tradeoff to manage, not a goal. In practice,
    IaC improves parallel work and lowers risk from undocumented manual changes.
  difficulty: junior
---
