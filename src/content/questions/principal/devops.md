---
defaultDomains:
- data-infra
defaultTopics:
- devops
questions:
- q: What is biggest operational challenge of container orchestration at enterprise scale?
  options:
  - text: Managing complexity across networking, security, storage, scaling, and cluster operations
    correct: true
  - text: Ensuring container image registries are available across all regions with acceptable pull latency
    correct: false
  - text: Preventing namespace proliferation that leads to resource quota conflicts across teams
    correct: false
  - text: Maintaining pod scheduling efficiency as cluster node count grows beyond a few hundred
    correct: false
  explanation: Enterprise orchestration is hard because many distributed systems concerns interact at once. Registry availability,
    namespace sprawl, and scheduler efficiency are real operational problems but are individual symptoms of the broader complexity
    challenge. Managed platforms can reduce some burden, but complexity remains. Success depends on strong operational patterns,
    not only tool choice.
  difficulty: principal
---
