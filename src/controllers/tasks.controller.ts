import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { apiResponse } from '../utils/api-response';
import { MESSAGES } from '../constants/messages';
import { ERROR_CODES } from '../constants/error-codes';

export const tasksController = {

  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId as string;
      const status = req.query.status as string | undefined;
      const tasks = await tasksService.findByProject(projectId, status);
      res.status(200).json(apiResponse(200, 'Tareas obtenidas correctamente', tasks));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.findById(req.params.id as string);
      if (!task) {
        res.status(404).json(apiResponse(404, MESSAGES.TASK_NOT_FOUND, undefined, ERROR_CODES.TASK_NOT_FOUND));
        return;
      }
      res.status(200).json(apiResponse(200, MESSAGES.TASK_FOUND, task));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.create(req.body as CreateTaskDto, req.user!.id);
      res.status(201).json(apiResponse(201, MESSAGES.TASK_CREATED, task));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.update(req.params.id as string, req.body as UpdateTaskDto, req.user!.id);
      res.status(200).json(apiResponse(200, MESSAGES.TASK_UPDATED, task));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await tasksService.remove(req.params.id as string, req.user!.id);
      res.status(200).json(apiResponse(200, MESSAGES.TASK_DELETED));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },
};
