import { Context } from 'egg';
import userErrorCodes from '../error_codes/user'
import { jwtCheck } from '../utils/jwt';

export default function userAuthMiddleware() {
  return async (ctx: Context, next: any) => {
    const authorization = ctx.get('Authorization')
    if (authorization && typeof authorization === 'string') {
      const authArr = authorization.split('Bearer ')
      if (authArr[1]) {
        jwtCheck(authArr[1]).then(async () => {
          await next();
        }).catch(() => {
          ctx.status = 401
          ctx.body = userErrorCodes.USER_NOT_AUTHORIZED
        })
      } else {
        ctx.status = 401
        ctx.body = userErrorCodes.USER_NOT_AUTHORIZED
      }
    } else {
      ctx.status = 401
      ctx.body = userErrorCodes.USER_NOT_AUTHORIZED
    }
  };
}