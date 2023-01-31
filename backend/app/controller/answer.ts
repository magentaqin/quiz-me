import { Controller } from 'egg';
import globalErrorCodes from '../error_codes/global';
import { generateUuid } from '../utils/hash';
import userErrorCodes from '../error_codes/user';

export default class AnswerController extends Controller {
  public async addAnswer() {
    try {
      const { prisma } = this.app;
      const { questionId, content } = this.ctx.request.body;
      if (!questionId || !content) {
        this.ctx.status = 400;
        this.ctx.body = globalErrorCodes.REQUIRED_PARAMETERS_NOT_PROVIDED;
        return;
      }
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
        this.ctx.status = 401;
        this.ctx.body = userErrorCodes.USER_NOT_EXIST;
        return;
      }
      // 02 escape answer content
      const escapedAnswerContent = this.ctx.helper.escape(content);
      const resp = await prisma.answer.create({
        data: {
          answerId: generateUuid(`${Date.now()} + ${content.split(0, 10)}`),
          questionId,
          authorId: userResp.userId,
          content: escapedAnswerContent,
        },
      }).catch(e => {
        throw new Error(e);
      });
      if (resp) {
        this.ctx.status = 200;
        this.ctx.body = {
          answerId: resp.answerId,
        };
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }
}
