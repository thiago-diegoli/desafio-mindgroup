import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

export default prisma;
