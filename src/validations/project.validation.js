import z from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters long").max(50, "Project name must be at most 100 characters long"),
});

