import { Context } from 'egg';

export default function logMiddleware() {
  return async (ctx: Context, next: any) => {
    ctx.app.logger.info(`${JSON.stringify(ctx.request)} Start at ====== ${new Date()}`);
    await next();
    ctx.app.logger.info(`${JSON.stringify(ctx.request)} End at =======${new Date()}`);
  };
}
