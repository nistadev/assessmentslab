import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const difficultyEnum = z.enum(['junior', 'mid', 'senior', 'principal']);

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    category: z.string(),
    questions: z.array(
      z.object({
        q: z.string(),
        options: z.array(
          z.object({
            text: z.string(),
            correct: z.boolean(),
          })
        ),
        explanation: z.string(),
        isCode: z.boolean().default(false),
        difficulty: difficultyEnum,
      })
    ),
  }),
});

export const collections = { questions };
