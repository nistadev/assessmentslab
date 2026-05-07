export interface DomainOption {
  domain: string;
  name: string;
  description: string;
}

export interface TopicOption {
  topic: string;
  name?: string;
  description?: string;
  domains: string[];
}

export const DOMAIN_OPTIONS: DomainOption[] = [
  {
    domain: 'frontend',
    name: 'Frontend',
    description: 'Browser platform, frontend frameworks, and client-side engineering.',
  },
  {
    domain: 'backend',
    name: 'Backend',
    description: 'Server-side patterns: APIs, databases (SQL/NoSQL), DDD, file I/O, and integrations.',
  },
  {
    domain: 'computer-science',
    name: 'Computer Science',
    description: 'Language-agnostic fundamentals: algorithms, data structures, design patterns, and SOLID.',
  },
  {
    domain: 'data-infra',
    name: 'Data & Infrastructure',
    description: 'Data systems, pipelines, deployments, and operations.',
  },
];

export const TOPIC_OPTIONS: TopicOption[] = [
  { topic: 'frontend', name: 'Web Platform', domains: ['frontend'] },
  { topic: 'javascript-typescript', name: 'JavaScript / TypeScript', domains: ['frontend', 'backend'] },
  { topic: 'react', name: 'React', domains: ['frontend'] },
  { topic: 'angular', name: 'Angular', domains: ['frontend'] },
  { topic: 'backend', name: 'Backend', domains: ['backend'] },
  { topic: 'nodejs', name: 'Node.js', domains: ['backend'] },
  { topic: 'python', name: 'Python', domains: ['backend'] },
  { topic: 'algorithms', name: 'Algorithms', domains: ['computer-science'] },
  { topic: 'data-structures', name: 'Data Structures', domains: ['computer-science'] },
  { topic: 'design-patterns', name: 'Design Patterns', domains: ['computer-science', 'frontend'] },
  { topic: 'solid-principles', name: 'SOLID Principles', domains: ['computer-science', 'frontend'] },
  { topic: 'data-engineering', name: 'Data Engineering', domains: ['data-infra'] },
  { topic: 'devops', name: 'DevOps', domains: ['data-infra'] },
];

export function getDomainLabel(domain: string) {
  return DOMAIN_OPTIONS.find(option => option.domain === domain)?.name ?? domain;
}

export function getTopicLabel(topic: string) {
  return TOPIC_OPTIONS.find(option => option.topic === topic)?.name ?? topic;
}
