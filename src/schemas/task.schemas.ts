import { z } from 'zod';
import { Status } from '@prisma/client';

export const createTaskSchema = z.object({
  body: z.object({
    title:       z.string().min(1, 'El título es requerido'),
    description: z.string().optional(),
    status:      z.nativeEnum(Status).optional().default('TODO'),
    projectId:   z.string().uuid('projectId debe ser un UUID válido'),
    assignedTo:  z.string().uuid('assignedTo debe ser un UUID válido').optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title:       z.string().min(1).optional(),
    description: z.string().optional(),
    status:      z.nativeEnum(Status).optional(),
    assignedTo:  z.string().uuid().optional().nullable(),
  }),
});
