import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, photo } = req.body;
    const cryptoPassword = await bcrypt.hash(password, 10);
    const photoBuffer = photo ? Buffer.from(photo, 'base64') : null;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: cryptoPassword,
        photo: photoBuffer,
      },
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `${err.message} - Erro no servidor` });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(403).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.EXPIRES_IN }
    );

    return res.status(200).json({
      access_token: token,
      userId: user.id,
      name: user.name,
      photo: user.photo ? user.photo.toString('base64') : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `${err.message} - Erro no servidor` });
  }
};

export const updateUserPhoto = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { photoBase64 } = req.body;
    const userId = req.params.userId;

    const photoBuffer = Buffer.from(photoBase64, 'base64');

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { photo: photoBuffer },
    });

    return res.status(200).json({
      ...updatedUser,
      photo: photoBuffer.toString('base64'),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `${err.message} - Erro no servidor` });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = Number(id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo ? user.photo.toString('base64') : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `${err.message} - Erro no servidor` });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true
      },
    });

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};
