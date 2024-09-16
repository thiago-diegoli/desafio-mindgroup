import { Request, Response } from 'express';
import prisma from '../utils/database';
import { AuthenticatedRequest } from '../types';
import { validationResult } from 'express-validator';

export const createTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, description, deliveryDate, projectId, responsibleId } = req.body;
    const deliveryDateISO = new Date(deliveryDate).toISOString();
    
    const task = await prisma.task.create({
      data: {
        name,
        description,
        status: 'pending',
        deliveryDate: deliveryDateISO,
        project: {
          connect: { id: projectId },
        },
        responsible: {
          connect: { id: responsibleId },
        },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        responsible: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tasks = await prisma.task.findMany({
      where: { projectId: Number(id) },
      include: {
        project: true,
        responsible: true,
      },
    });

    if (tasks.length === 0) {
      return res.status(200).json({ message: 'Nenhuma tarefa encontrada para este projeto.' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tasks = await prisma.task.findMany({
      where: { responsibleId: Number(id) },
      include: {
        project: true,
        responsible: true,
      },
    });

    if (tasks.length === 0) {
      return res.status(200).json({ message: 'Nenhuma tarefa encontrada para este usuário.' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { taskId, status } = req.body;

    const task = await prisma.task.update({
      where: { id: Number(taskId) },
      data: { status },
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.userId;

    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: { project: true },
    });

    if (task.project.userId !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar esta tarefa.'});
    }

    await prisma.task.delete({ where: { id: Number(taskId) } });

    res.status(200).json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};