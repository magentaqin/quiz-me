import { Controller } from 'egg';
import globalErrorCodes from '../error_codes/global';
import userErrorCodes from '../error_codes/user';
import { generateUuid } from '../utils/hash';

export default class QuestionController extends Controller {
  // Add Question
  public async addQuestion() {
    try {
      const { prisma } = this.app;
      const { title, tags, description } = this.ctx.request.body;
      if (!title || !Array.isArray(tags)) {
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
      // 02 escape question title and description
      const escapedTitle = this.ctx.helper.escape(title);
      const escapedDescription = description ? this.ctx.helper.escape(description) : '';

      // // 03 use transaction to insert one record into Question Table and multiple records into QuestionTag Table
      const tagsToCreate = tags.map(item => {
        return {
          tag: {
            create: { name: item, tagId: generateUuid(item) },
          },
        };
      });
      const resp = await prisma.question.create({
        data: {
          questionId: generateUuid(escapedTitle),
          authorId: userResp.userId,
          title: escapedTitle,
          description: escapedDescription,
          tags: {
            create: tagsToCreate,
          },
        },
      }).catch(e => {
        throw new Error(e);
      });
      if (resp) {
        this.ctx.status = 200;
        this.ctx.body = {
          questionId: resp.questionId,
          description: resp.description,
          tags,
        };
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  // Get Question Tag List
  public async listQuestionTag() {
    try {
      const { prisma } = this.app;
      const resp = await prisma.questionTag.findMany({
        distinct: [ 'name' ],
        orderBy: {
          name: 'asc',
        },
        select: {
          name: true,
          tagId: true,
        },
      }).catch(e => {
        throw new Error(e);
      });
      if (Array.isArray(resp)) {
        this.ctx.status = 200;
        this.ctx.body = {
          tags: resp,
        };
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  public async listQuestion() {
    try {
      const { prisma } = this.app;
      const { offset, count, keyword, ...tags } = this.ctx.query;
      const queryTags: string[] = [];
      Object.keys(tags).forEach(tagKey => {
        if (/tags\[[0-9]{1,}\]/.test(tagKey)) {
          queryTags.push(tags[tagKey]);
        }
      });
      let questions: any[] = [];
      // TODO Consider using Transaction
      if (queryTags.length) {
        for (const tag of queryTags) {
          const perResult = await prisma.question.findMany({
            select: {
              questionId: true,
              title: true,
              description: true,
              tags: true,
            },
            where: {
              title: {
                search: keyword ? `${keyword}*` : undefined,
              },
              description: {
                search: keyword ? `${keyword}*` : undefined,
              },
              tags: {
                some: {
                  tag: {
                    name: tag,
                  },
                },
              },
            },
          }).catch(e => {
            throw new Error(e);
          });
          if (Array.isArray(perResult)) {
            questions = questions.concat(perResult);
          } else {
            throw new Error();
          }
        }
        // TODO Primsa skip and take not working in many-to-many relation
        questions = questions.slice(Number(offset), Number(count));
      } else {
        const perResult = await prisma.question.findMany({
          select: {
            questionId: true,
            title: true,
            description: true,
            tags: true,
          },
          skip: Number(offset),
          take: Number(count),
          where: {
            title: {
              search: keyword ? `${keyword}*` : undefined,
            },
            description: {
              search: keyword ? `${keyword}*` : undefined,
            },
          },
        }).catch(e => {
          throw new Error(e);
        });
        if (Array.isArray(perResult)) {
          questions = questions.concat(perResult);
        } else {
          throw new Error();
        }
      }

      this.ctx.status = 200;
      this.ctx.body = {
        questions,
      };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  public async countQuestion() {
    try {
      const { prisma } = this.app;
      const { keyword } = this.ctx.query;
      const resp = await prisma.question.aggregate({
        _count: {
          questionId: true,
        },
        where: {
          title: {
            search: keyword ? `${keyword}*` : undefined,
          },
          description: {
            search: keyword ? `${keyword}*` : undefined,
          },
        },
      }).catch(e => {
        throw new Error(e);
      });
      if (resp) {
        this.ctx.status = 200;
        this.ctx.body = {
          count: resp._count.questionId,
        };
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  // Get question by id
  public async getQuestion() {
    try {
      const { prisma } = this.app;
      const { id } = this.ctx.query;
      if (!id) {
        this.ctx.status = 400;
        this.ctx.body = globalErrorCodes.REQUIRED_PARAMETERS_NOT_PROVIDED;
       return
      }
      const resp = await prisma.question.findUnique({
        where: {
          questionId: id,
        },
      }).catch(e => {
        throw new Error(e);
      });
      if (resp) {
        const { title, description } = resp
        this.ctx.status = 200;
        this.ctx.body = {
          title,
          description
        }
     }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }
}
