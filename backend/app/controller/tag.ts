import { Controller } from 'egg';
import globalErrorCodes from '../error_codes/global';
import userErrorCodes from '../error_codes/user';
import { generateUuid } from '../utils/hash';

interface TagItem {
  name: string;
  description: string;
}

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
      const resp = await prisma.questionTag.findMany({
        where: {
          status: 'NORMAL'
        },
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

  public async batchSetTags() {
    try {
      const { prisma } = this.app;
      const { tags } = this.ctx.request.body as { tags: TagItem[] };
      if (!Array.isArray(tags)) {
        this.ctx.status = 400;
        this.ctx.body = globalErrorCodes.REQUIRED_PARAMETERS_NOT_PROVIDED;
        return;
      }

      const requestTagKeys = tags.map(item => item.name)
      const existTags = await prisma.questionTag.findMany({
        where: {
          status: 'NORMAL',
        },
      });

      const updatedTagKeys: string[] = existTags.map(item => item.name)
      const tagsToCreate = tags.filter(item => !updatedTagKeys.includes(item.name)).map((item) => {
        return {
          name: this.ctx.helper.escape(item.name),
          description: this.ctx.helper.escape(item.name),
          tagId: generateUuid(item.name),
        }
      })
      if (tagsToCreate.length) {
        await prisma.questionTag.createMany({
          data: tagsToCreate,
        })
      }

      for (const tagItem of existTags) {
        // only update tag description
        if (requestTagKeys.includes(tagItem.name)) {
          await prisma.questionTag.update({
            where: {
              tagId: tagItem.tagId,
            },
            data: {
              description: tags.find(item => item.name === tagItem.name)?.description || ''
            },
          })
        }
      }
      this.ctx.status = 200;
      this.ctx.body = {
        msg: 'Batch set tags successfully!',
      };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  public async deleteTags() {
    // old tags have related tags and created_at before 2023-05-06, set the status to DELETED
    try {
      const { prisma } = this.app;
      const resp = await prisma.questionTag.updateMany({
        where: {
          createdAt: {
            // date before 2023-05-06
            lte: new Date('2023-05-06'),
          },
          NOT: {
            questions: undefined,
          },
        },
        data: {
          status: 'DELETED',
        },
      }).catch(err => {
        console.log('delete tags err', err)
      });
      if (resp) {
        this.ctx.status = 200;
        this.ctx.body = resp;
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }
}
