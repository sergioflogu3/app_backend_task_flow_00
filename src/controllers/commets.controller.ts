import { Request, Response } from 'express';
import { commentsService } from '../services/commets.service';
import { CreateCommentDto } from '../types/comment.types';
import { apiResponse } from '../utils/api-response';
import { MESSAGES } from '../constants/messages';
import { ERROR_CODES } from '../constants/error-codes';

export const commetsController = {

  async getByTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId as string;
      const comments = await commentsService.findByTask(taskId);
      res.status(200).json(apiResponse(200, 'Comentarios obtenidos correctamente', comments));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentsService.create(req.body as CreateCommentDto, req.user!.id);
      res.status(201).json(apiResponse(201, MESSAGES.COMMENT_CREATED, comment));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await commentsService.remove(req.params.id as string, req.user!.id);
      res.status(200).json(apiResponse(200, MESSAGES.COMMENT_DELETED));
    } catch (e: any) {
      const status = e?.status ?? 500;
      res.status(status).json(apiResponse(status, e?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },
};
