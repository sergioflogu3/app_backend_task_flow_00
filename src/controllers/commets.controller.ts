import { Request, Response } from 'express';
import { commentsService } from '../services/commets.service';
import { CreateCommentDto } from '../types/comment.types';

export const commetsController = {

  async getByTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId as string;
      const comments = await commentsService.findByTask(taskId);
      res.json({ data: comments, count: comments.length });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentsService.create(
        req.body as CreateCommentDto,
        req.user!.id
      );
      res.status(201).json({ data: comment });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await commentsService.remove(req.params.id as string, req.user!.id);
      res.status(204).send();
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },
};
