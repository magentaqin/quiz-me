import { Controller } from 'egg';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    await prisma.user.create({
      data: {
          email: 'elsa123@prisma.io',
          userName: 'Elsa Prisma 123',
          userId: 'elsaprisma123'
        },
      })
    ctx.body = await ctx.service.test.sayHi('egg');
  }
}
