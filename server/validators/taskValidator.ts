import { check } from 'express-validator';

export const taskValidator = [
  check('name')
    .notEmpty().withMessage('O nome da tarefa é obrigatório'),
  check('description')
    .optional(),
  check('status')
    .notEmpty().withMessage('O status da tarefa é obrigatório')
    .isIn(['pendente', 'em progresso', 'concluída']).withMessage('O status deve ser um dos seguintes: pendente, em progresso, concluída'),
  check('deliveryDate')
    .optional()
    .isISO8601().withMessage('A data de entrega deve ser uma data válida no formato ISO 8601'),
  check('responsibleId')
    .isInt({ gt: 0 }).withMessage('O responsável deve ser um usuário válido'),
  check('projectId')
    .isInt({ gt: 0 }).withMessage('O projeto deve ser válido')
];
