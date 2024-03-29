import { Controller } from 'egg';
import userErrorCodes from '../error_codes/user';
import globalErrorCodes from '../error_codes/global';
import { hashPassword, generateUuid, checkPassword } from '../utils/hash';
import { jwtSign } from '../utils/jwt';

export default class UserController extends Controller {
  public async signup() {
    try {
      const { prisma } = this.app;
      const { email, userName, password } = this.ctx.request.body;
      if (!email || !userName || !password) {
        this.ctx.status = 400;
        this.ctx.body = globalErrorCodes.REQUIRED_PARAMETERS_NOT_PROVIDED;
        return;
      }
      // 01 check whether user existed
      const userResp = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userResp) {
        this.ctx.status = 409;
        this.ctx.body = userErrorCodes.USER_ALRREADY_EXIST;
        return;
      }
      // 02 check wheter username duplicated
      const userNameResp = await prisma.user.findUnique({
        where: {
          userName,
        },
      });
      if (userNameResp) {
        this.ctx.status = 409;
        this.ctx.body = userErrorCodes.USER_NAME_DUPLICATE;
        return;
      }
      // 03 Hash Password with salt
      const hashedPassword = await hashPassword(password);
      // 04 JWT Sign token
      const userId = generateUuid(userName);
      const token = jwtSign({ userId });
      // 05 Create User
      await prisma.user.create({
        data: {
          email,
          userId,
          userName,
          password: hashedPassword,
          role: email === 'quizme@root.com' ? 'ADMIN' : 'USER',
        },
      });

      this.ctx.status = 201;
      this.ctx.body = {
        token,
        userName,
        userId,
      };

    } catch (err) {
      this.ctx.logger.error(err);
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  public async login() {
    try {
      const { prisma } = this.app;
      const { email, password } = this.ctx.request.body;
      if (!email || !password) {
        this.ctx.status = 400;
        this.ctx.body = globalErrorCodes.REQUIRED_PARAMETERS_NOT_PROVIDED;
      }

      // 01 find whether user exists
      const userResp = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!userResp) {
        this.ctx.status = 401;
        this.ctx.body = userErrorCodes.USER_NOT_EXIST;
        return;
      }

      // 02 validate password
      const isPasswordValid = await checkPassword(password, userResp.password).catch(() => {
        this.ctx.status = 401;
        this.ctx.body = userErrorCodes.USER_EMAIL_PASSWORD_NOT_MATCH;
      });
      if (!isPasswordValid) {
        this.ctx.status = 401;
        this.ctx.body = userErrorCodes.USER_EMAIL_PASSWORD_NOT_MATCH;
        return;
      }

      // 03 sign token
      const token = jwtSign({ userId: userResp.userId });

      this.ctx.status = 201;
      this.ctx.body = {
        token,
        userName: userResp.userName,
        userId: userResp.userId,
      };

    } catch (err) {
      this.ctx.logger.error(err);
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  public async getUserInfo() {
    try {
      const { prisma } = this.app;
      // 01 validate whether userId exists
      const userId = await this.ctx.service.auth.userAuth.getUserId(this.ctx);
      if (!userId) {
        this.ctx.status = 401;
        this.ctx.body = userErrorCodes.USER_NOT_AUTHORIZED;
      }
      const userResp = await prisma.user.findUnique({
        where: {
          userId,
        },
      });
      if (!userResp) {
        this.ctx.status = 200;
        this.ctx.body = userErrorCodes.USER_NOT_EXIST;
        return;
      }

      this.ctx.status = 200;
      this.ctx.body = {
        userName: userResp.userName,
        role: userResp.role,
      };

    } catch (err) {
      this.ctx.logger.error(err);
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }
}
