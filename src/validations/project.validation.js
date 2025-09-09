import z from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters long')
    .max(50, 'Project name must be at most 100 characters long'),
});


export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters long')
    .max(50, 'Project name must be at most 100 characters long')
    .optional(),
  description: z
    .string()
    .min(3, 'Project description must be at least 3 characters long')
    .max(1000, 'Project description must be at most 1000 characters long')
    .optional(),
});
