import { check } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loginValidator = [
  check('email')
    .notEmpty().withMessage('O email é obrigatório')
    .isEmail().withMessage('O email informado é inválido'),
  check('password')
    .notEmpty().withMessage('A senha é obrigatória')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
];

export const registerValidator = [
  check('name')
    .notEmpty().withMessage('O nome é obrigatório'),
  check('email')
    .notEmpty().withMessage('O email é obrigatório')
    .isEmail().withMessage('O email informado é inválido')
    .custom(async (email) => {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (user) {
        throw new Error('O email já está registrado');
      }
    }),
  check('password')
    .notEmpty().withMessage('A senha é obrigatória')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  check('photo')
    .optional()
    .isBase64().withMessage('A foto deve estar no formato base64')
];

export const updateUserPhotoValidator = [
  check('photoBase64')
    .notEmpty().withMessage('A foto é obrigatória')
    .isBase64().withMessage('A foto deve estar no formato base64')
];

export const getUserByIdValidator = [
  check('id')
    .isInt({ gt: 0 }).withMessage('ID deve ser um número inteiro positivo')
];
