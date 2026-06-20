import { Status } from '@prisma/client';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: Status;
  projectId: string;
  assignedTo?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Status;
  assignedTo?: string | null;
}
