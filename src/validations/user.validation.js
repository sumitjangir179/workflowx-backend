import z from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updateUserDetailsSchema = z.object({
  name: z.string().min(3, 'Name must be at least 2 characters long').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
});
