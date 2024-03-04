import { z } from "zod";

export const CompleteTaskFormSchema = z.object({
    taskId: z.number(),
});