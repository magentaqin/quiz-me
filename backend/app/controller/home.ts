import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx, app } = this;
    await app.prisma.user.create({
      data: {
          email: 'elsa123465@prisma.io',
          userName: 'Elsa Prisma 123456',
          userId: 'elsaprisma123456'
        },
      })
    ctx.body = await ctx.service.test.sayHi('egg');
  }
}
