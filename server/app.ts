import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/database';
import loginRoute from './routes/loginRoute';
import projectRoute from './routes/projectRoute';
import taskRoute from './routes/taskRoute';
import fs from 'fs'
import swaggerUI from 'swagger-ui-express'

import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"
const swaggerFilePath = path.join(__dirname, 'swagger/swagger_output.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

connectToDatabase();

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');


// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
  customCss:
    '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL
}));

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
