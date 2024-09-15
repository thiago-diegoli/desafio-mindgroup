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
    return res.status(500).json({ message: `${err.message} - Server Error` });
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
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.SECRET_KEY!,
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
    return res.status(500).json({ message: `${err.message} - Server Error` });
  }
};
