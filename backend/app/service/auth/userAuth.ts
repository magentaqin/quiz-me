import { Service } from 'egg';
import { getUserIdFromToken } from '../../utils/jwt';

export default class UserAuthService extends Service {
  async getUserId(ctx) {
    const authorization = ctx.get('Authorization');
    if (authorization && typeof authorization === 'string') {
      const authArr = authorization.split('Bearer ');
      if (authArr[1]) {
        const userId = await getUserIdFromToken(authArr[1]);
        return userId;
      }
      return '';

    }
    return '';

  }
}
