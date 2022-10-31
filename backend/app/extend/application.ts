import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const extendedApp = {
  prisma,
}

export default extendedApp