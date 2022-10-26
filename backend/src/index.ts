import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const start = async () => {
  const user = await prisma.user.create({
    data: {
        email: 'elsa@prisma.io',
        userName: 'Elsa Prisma',
        userId: 'elsaprisma'
      },
    })
}

start()