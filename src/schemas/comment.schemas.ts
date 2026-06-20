import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'El contenido es requerido'),
    taskId:  z.string().uuid('taskId debe ser un UUID válido'),
  }),
});
