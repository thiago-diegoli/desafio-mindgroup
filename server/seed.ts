import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const createUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
};

const createProject = async (userId: number, name: string, description: string) => {
  return prisma.project.create({
    data: {
      name,
      description,
      userId,
    },
  });
};

const createTask = async (projectId: number, responsibleId: number, name: string, description: string, status: string, deliveryDate: Date | null) => {
  return prisma.task.create({
    data: {
      name,
      description,
      status,
      deliveryDate,
      projectId,
      responsibleId,
    },
  });
};

const seed = async () => {

  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  const testUser = await createUser('Usuário Teste', 'user@email.com', 'pass123');
  
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await createUser(
      faker.name.fullName(),
      faker.internet.email(),
      faker.internet.password()
    );
    users.push(user);
  }

  users.push(testUser);

  const projectCountForTestUser = Math.floor(Math.random() * 4) + 3;
  const testUserProjects = [];
  for (let i = 0; i < projectCountForTestUser; i++) {
    const project = await createProject(
      testUser.id,
      faker.company.catchPhrase(),
      faker.lorem.sentence()
    );
    testUserProjects.push(project);
  }

  for (const project of testUserProjects) {
    const taskCount = Math.floor(Math.random() * 5) + 4;
    for (let i = 0; i < taskCount; i++) {
      await createTask(
        project.id,
        testUser.id,
        faker.lorem.words(3),
        faker.lorem.sentence(),
        Math.random() > 0.5 ? 'completed' : 'pending',
        Math.random() > 0.5 ? faker.date.future() : null
      );
    }
  }

  for (const user of users) {
    if (user.id !== testUser.id) {
      const projectCount = Math.floor(Math.random() * 4) + 3;
      const projects = [];
      for (let i = 0; i < projectCount; i++) {
        const project = await createProject(
          user.id,
          faker.company.catchPhrase(),
          faker.lorem.sentence()
        );
        projects.push(project);
      }

      for (const project of projects) {
        const taskCount = Math.floor(Math.random() * 5) + 4;
        for (let i = 0; i < taskCount; i++) {
          await createTask(
            project.id,
            users[Math.floor(Math.random() * users.length)].id,
            faker.lorem.words(3),
            faker.lorem.sentence(),
            Math.random() > 0.5 ? 'completed' : 'pending',
            Math.random() > 0.5 ? faker.date.future() : null
          );
        }
      }
    }
  }

  console.log('Dados inseridos com sucesso!');
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
