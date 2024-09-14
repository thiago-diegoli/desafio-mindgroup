import { Request, Response } from 'express';
import prisma from '../utils/database';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, description, status, deliveryDate, projectId, responsibleId } = req.body;

    const task = await prisma.task.create({
      data: {
        name,
        description,
        status,
        deliveryDate,
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
