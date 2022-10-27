import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const start = async () => {
  const user = await prisma.user.create({
    data: {
        email: 'elsa123@prisma.io',
        userName: 'Elsa Prisma 123',
        userId: 'elsaprisma123'
      },
    })
}

start()