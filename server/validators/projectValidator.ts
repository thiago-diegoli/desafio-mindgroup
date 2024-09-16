import { check } from 'express-validator';

export const projectValidator = [
  check('name')
    .notEmpty().withMessage('O nome do projeto é obrigatório'),
  check('description')
    .optional()
    .isString().withMessage('A descrição deve ser uma string'),
  check('userId')
    .notEmpty().withMessage('O ID do usuário é obrigatório')
    .isInt({ min: 1 }).withMessage('O ID do usuário deve ser um número inteiro positivo')
];
