import z from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters long").max(50, "Project name must be at most 100 characters long"),
});
export const getProjectDetailSchema = z.object({
    projectId: z.string().refine(val => !isNaN(parseInt(val, 10)) && /^\d+$/.test(val), "Invalid project id")
})

