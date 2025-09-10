import z from 'zod';

export const createTaskSchema = z.object({
  name: z.string().min(3, 'Task name must be at least 3 characters long'),
  projectId: z.uuid('Project ID must be an integer'),
});

export const updateTaskSchema = z.object({
  name: z
    .string()
    .min(3, 'Task name must be at least 3 characters long')
    .optional(),
  description: z.string().optional(),
  tag: z
    .enum([
      'feat',
      'bug',
      'chore',
      'docs',
      'style',
      'refactor',
      'test',
      'ci',
      'perf',
      'build',
      'revert',
    ])
    .optional(),
  dueDate: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done', 'archived']).optional(),
  taskId: z.uuid('Task ID must be a valid UUID'),
});
