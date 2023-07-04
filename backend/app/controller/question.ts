import { Controller } from 'egg';
import globalErrorCodes from '../error_codes/global';
import userErrorCodes from '../error_codes/user';
import { generateUuid } from '../utils/hash';

export default class QuestionController extends Controller {
  // Add Question
  public async addQuestion() {
    try {
      const { prisma } = this.app;
      const { title, tags, description, level } = this.ctx.request.body;
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


      // 03 decouple question create and tag create
      // here, we only insert record into Question and TagsOnQuestions Table
      const resp = await prisma.question.create({
        data: {
          questionId: generateUuid(escapedTitle),
          authorId: userResp.userId,
          title: escapedTitle,
          description: escapedDescription,
          level,
        },
      }).catch(e => {
        throw new Error(e);
      });
      if (resp.questionId) {
        const dataToInsert = tags.map(tagId => {
          return {
            questionId: resp.questionId,
            tagId,
          };
        });
        const relationResp = await prisma.tagsOnQuestions.createMany({
          data: dataToInsert,
        }).catch(e => {
          throw new Error(e);
        });
        if (relationResp) {
          this.ctx.status = 200;
          this.ctx.body = {
            questionId: resp.questionId,
            description: resp.description,
          };
        }
      }
    } catch (err) {
      this.ctx.logger.error(err);
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
      this.ctx.logger.error(err);
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
              level: true,
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
            for (const item of perResult) {
              const tagResult = await prisma.questionTag.findMany({
                select: {
                  tagId: true,
                  name: true,
                },
                where: {
                  questions: {
                    some: {
                      questionId: item.questionId,
                    },
                  },
                },
              });
              item.tags = tagResult as any;
            }
            questions = questions.concat(perResult);
          } else {
            throw new Error();
          }
        }
        // TODO Primsa skip and take not working in many-to-many relation
        questions = questions.slice(Number(offset), Number(count));
      } else {
        // TODO consider use prisma raw query to do left join query
        const perResult = await prisma.question.findMany({
          select: {
            questionId: true,
            title: true,
            description: true,
            tags: true,
            level: true,
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
          for (const item of perResult) {
            const tagResult = await prisma.questionTag.findMany({
              select: {
                tagId: true,
                name: true,
              },
              where: {
                questions: {
                  some: {
                    questionId: item.questionId,
                  },
                },
              },
            });
            item.tags = tagResult as any;
          }

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
      this.ctx.logger.error(err);
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
      this.ctx.logger.error(err);
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
        return;
      }
      const resp = await prisma.question.findUnique({
        where: {
          questionId: id,
        },
        select: {
          title: true,
          description: true,
          level: true,
          authorId: true,
          tags: true,
        },
      }).catch(e => {
        throw new Error(e);
      });

      const totalTags = await prisma.questionTag.findMany({
        where: {
          status: 'NORMAL',
        },
        select: {
          name: true,
          tagId: true,
          description: true,
        },
      });

      if (resp) {
        const { title, description, level, authorId, tags } = resp;
        const tagIds = tags.map(item => item.tagId);
        const questionTags = totalTags.filter(item => tagIds.includes(item.tagId));
        this.ctx.status = 200;
        this.ctx.body = {
          title,
          description,
          level,
          authorId,
          tags: questionTags,
        };
      }
    } catch (err) {
      this.ctx.logger.error(err);
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }

  // Update Question
  public async updateQuestion() {
    try {
      const { prisma } = this.app;
      const { title, tags, description, level, questionId } = this.ctx.request.body;
      if (!title || !Array.isArray(tags) || !questionId) {
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

      // 02 check whether this question is authored by the user
      const questionResp = await prisma.question.findUnique({
        where: {
          questionId,
        },
      });
      if (!questionResp || questionResp.authorId !== userId) {
        this.ctx.status = 403;
        this.ctx.body = globalErrorCodes.AUTH_NOT_PERMITTED;
        return;
      }

      // 03 escape question title and description
      const escapedTitle = this.ctx.helper.escape(title);
      const escapedDescription = description ? this.ctx.helper.escape(description) : '';

      // 04 update question table
      const resp = await prisma.question.update({
        where: {
          questionId,
        },
        data: {
          title: escapedTitle,
          description: escapedDescription,
          level,
        },
      }).catch(e => {
        throw new Error(e);
      });

      // 05 update TagsOnQuestions table
      const oldTags = await prisma.tagsOnQuestions.findMany({
        where: {
          questionId,
        },
      });

      const tagsToCreate: string[] = [];
      const tagsToDelete: string[] = [];
      const existTags: string[] = [];
      oldTags.forEach(item => {
        if (tags.includes(item.tagId)) {
          existTags.push(item.tagId);
        } else {
          tagsToDelete.push(item.tagId);
        }
      });
      tags.forEach(id => {
        if (!existTags.includes(id) && !tagsToDelete.includes(id)) {
          tagsToCreate.push(id);
        }
      });
      // hard delete tags
      await prisma.tagsOnQuestions.deleteMany({
        where: {
          tagId: {
            in: tagsToDelete,
          },
        },
      });
      // create new tags
      const tagsToInsert = tagsToCreate.map(tagId => {
        return {
          questionId: resp.questionId,
          tagId,
        };
      });
      await prisma.tagsOnQuestions.createMany({
        data: tagsToInsert,
      });
      if (resp) {
        this.ctx.status = 200;
        this.ctx.body = {
          questionId: resp.questionId,
          description: resp.description,
        };
      }
    } catch (err) {
      this.ctx.logger.error(err);
      this.ctx.status = 500;
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
    }
  }
}
