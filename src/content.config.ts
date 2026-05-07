import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const difficultyEnum = z.enum(['junior', 'mid', 'senior', 'principal']);

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    defaultDomains: z.array(z.string()).min(1),
    defaultTopics: z.array(z.string()).min(1),
    questions: z.array(
      z.object({
        q: z.string(),
        domains: z.array(z.string()).min(1).optional(),
        topics: z.array(z.string()).min(1).optional(),
        options: z.array(
          z.object({
            text: z.string(),
            correct: z.boolean(),
          })
        ),
        explanation: z.string(),
        code: z.string().optional(),
        difficulty: difficultyEnum,
      })
    ),
  }),
});

export const collections = { questions };
