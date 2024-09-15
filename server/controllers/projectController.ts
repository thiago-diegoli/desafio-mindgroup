import { Request, Response } from 'express';
import prisma from '../utils/database';
import { AuthenticatedRequest } from '../types';

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
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

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: 'O ID do projeto é necessário' });
    }

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: {
        user: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este projeto' });
    }

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    if (project.userId !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este projeto' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: Number(projectId) },
      data: {
        name,
        description,
      },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    if (project.userId !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este projeto' });
    }

    await prisma.project.delete({
      where: { id: Number(projectId) },
    });

    res.status(200).json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
