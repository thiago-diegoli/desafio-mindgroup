import { Request, Response } from 'express';
import prisma from '../utils/database';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'O ID do usuário é necessário' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        user: { connect: { id: Number(userId) } },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjectsById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'O ID do usuário é necessário' });
    }

    const projects = await prisma.project.findMany({
      where: { userId: Number(userId) },
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
