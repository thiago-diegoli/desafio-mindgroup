import { Request, Response } from 'express';
import prisma from '../utils/database';
import { AuthenticatedRequest } from '../types';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, description, status, deliveryDate, projectId } = req.body;

    const task = await prisma.task.create({
      data: {
        name,
        description,
        status,
        deliveryDate,
        project: {
          connect: { id: projectId },
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

export const assignTaskOwner = async (req: Request, res: Response) => {
  try {
    const { taskId, userId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
    });

    if (task.responsibleId) {
      return res.status(400).json({ message: 'Esta tarefa já possui um responsável.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: { responsibleId: Number(userId) },
    });

    res.status(200).json(updatedTask);
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
    const userId = req.user?.id;

    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: { project: true },
    });

    if (task.project.userId !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar esta tarefa.' });
    }

    await prisma.task.delete({ where: { id: Number(taskId) } });

    res.status(200).json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
