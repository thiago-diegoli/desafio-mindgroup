import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/database';
import loginRoute from './routes/loginRoute';
import projectRoute from './routes/projectRoute';
import taskRoute from './routes/taskRoute';

import cors from 'cors';

dotenv.config();

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'API Mind',
    version: '1.0.0',
  });
});

app.use('/api/logins', loginRoute);
app.use('/api/projects', projectRoute);
app.use('/api/tasks', taskRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
