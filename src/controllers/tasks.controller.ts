import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';

export const tasksController = {

  // GET /api/projects/:projectId/tasks?status=TODO
  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId as string;
      const status = req.query.status as string | undefined;
      const tasks = await tasksService.findByProject(projectId, status);
      res.json({ data: tasks, count: tasks.length });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  // GET /api/tasks/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.findById(req.params.id as string);
      if (!task) { res.status(404).json({ error: 'Tarea no encontrada' }); return; }
      res.json({ data: task });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  // POST /api/tasks  (requiere auth)
  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.create(
        req.body as CreateTaskDto,
        req.user!.id
      );
      res.status(201).json({ data: task });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  // PUT /api/tasks/:id  (requiere auth)
  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.update(
        req.params.id as string,
        req.body as UpdateTaskDto,
        req.user!.id
      );
      res.json({ data: task });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  // DELETE /api/tasks/:id  (requiere auth)
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await tasksService.remove(req.params.id as string, req.user!.id);
      res.status(204).send();
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },
};
