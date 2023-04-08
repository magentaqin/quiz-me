import { Controller } from 'egg';
import globalErrorCodes from '../error_codes/global';
import userErrorCodes from '../error_codes/user';
import { generateUuid } from '../utils/hash';

export default class TagController extends Controller {
  public async addTag() {
    try {
      const { prisma } = this.app;
      const { name, description } = this.ctx.request.body;
      if (!name || !description) {
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
      if (userResp.role !== 'ADMIN') {
        this.ctx.status = 403;
        this.ctx.body = globalErrorCodes.AUTH_NOT_PERMITTED;
        return;
      }
      // 02 escape tag name and description
      const escapedName: string = this.ctx.helper.escape(name);
      const escapedDesc: string = this.ctx.helper.escape(description);

      // 03 create question tag
      const resp = await prisma.questionTag.create({
        data: {
          name: escapedName,
          description: escapedDesc,
          tagId: generateUuid(escapedName),
        },
      }).catch(e => {
        console.log('create tag error', e);
        throw new Error(e);
      });
      if (resp) {
        this.ctx.status = 200;
        this.ctx.body = {
          tagId: resp.tagId,
        };
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  public async listTag() {
    try {
      const { prisma } = this.app;
      const { offset, count } = this.ctx.query;
      const resp = await prisma.questionTag.findMany({
        skip: Number(offset),
        take: Number(count),
        select: {
          tagId: true,
          name: true,
          description: true,
        },
        orderBy: [
          { updatedAt: 'desc' },
        ],
      });
      if (Array.isArray(resp)) {
        this.ctx.status = 200;
        this.ctx.body = resp;
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  public async updateTag() {
    try {

    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  // historical reason: the name of tag duplicated with each.
  // we want to merge them into one and hard delete rest tags
  // in next version, we could add the unique constraint.
  public async mergeTags() {

  }
}
