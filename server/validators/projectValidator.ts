import { check } from 'express-validator';

export const projectValidator = [
  check('name')
    .notEmpty().withMessage('O nome do projeto é obrigatório'),
  check('description')
    .optional()
];
