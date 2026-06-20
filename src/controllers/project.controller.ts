import { Request, Response } from 'express';
import { CreateProjectDto, UpdateProjectDto } from '../types/project.types';
import { projectsService } from '../services/project.service';
import { apiResponse } from '../utils/api-response';
import { MESSAGES } from '../constants/messages';
import { ERROR_CODES } from '../constants/error-codes';

export const projectsController = {

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectsService.findAll();
      res.status(200).json(apiResponse(200, 'Proyectos obtenidos correctamente', projects));
    } catch {
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectsService.findById(req.params.id as string);
      if (!project) {
        res.status(404).json(apiResponse(404, MESSAGES.PROJECT_NOT_FOUND, undefined, ERROR_CODES.PROJECT_NOT_FOUND));
        return;
      }
      res.status(200).json(apiResponse(200, MESSAGES.PROJECT_FOUND, project));
    } catch {
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, ownerId } = req.body as CreateProjectDto;
      if (!name || !ownerId) {
        res.status(400).json(apiResponse(400, MESSAGES.VALIDATION_ERROR, undefined, ERROR_CODES.VALIDATION_ERROR));
        return;
      }
      const project = await projectsService.create({ name, description, ownerId });
      res.status(201).json(apiResponse(201, MESSAGES.PROJECT_CREATED, project));
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'P2003') {
        res.status(400).json(apiResponse(400, 'El ownerId no existe en la base de datos', undefined, ERROR_CODES.FOREIGN_KEY_ERROR));
        return;
      }
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as UpdateProjectDto;
      const project = await projectsService.update(req.params.id as string, { name, description });
      res.status(200).json(apiResponse(200, MESSAGES.PROJECT_UPDATED, project));
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'P2025') {
        res.status(404).json(apiResponse(404, MESSAGES.PROJECT_NOT_FOUND, undefined, ERROR_CODES.PROJECT_NOT_FOUND));
        return;
      }
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await projectsService.remove(req.params.id as string);
      res.status(200).json(apiResponse(200, MESSAGES.PROJECT_DELETED));
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'P2025') {
        res.status(404).json(apiResponse(404, MESSAGES.PROJECT_NOT_FOUND, undefined, ERROR_CODES.PROJECT_NOT_FOUND));
        return;
      }
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },
};
