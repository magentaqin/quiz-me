import { Controller } from 'egg';
import globalErrorCodes from '../error_codes/global'
import userErrorCodes from '../error_codes/user';
import { generateUuid } from '../utils/hash';

export default class QuestionController extends Controller {
    public async addQuestion() {
      try {
        const { prisma } = this.app
        const { title, tags, description } = this.ctx.request.body
        if (!title || !Array.isArray(tags)) {
          this.ctx.status = 400
          this.ctx.body = globalErrorCodes.REQUIRED_PARAMETERS_NOT_PROVIDED
          return
        }
        // 01 validate whether userId exists
        const userId = await this.ctx.service.auth.userAuth.getUserId(this.ctx)
        if (!userId) {
          this.ctx.status = 401
          this.ctx.body = userErrorCodes.USER_NOT_AUTHORIZED
        }
        const userResp = await prisma.user.findUnique({
          where: {
            userId,
          }
        })
        if (!userResp) {
          this.ctx.status = 401
          this.ctx.body = userErrorCodes.USER_NOT_EXIST
          return
        }
        // 02 escape question title and description
        const escapedTitle = this.ctx.helper.escape(title)
        const escapedDescription = description ? this.ctx.helper.escape(description) : ''

        // // 03 use transaction to insert one record into Question Table and multiple records into QuestionTag Table
        const tagsToCreate = tags.map(item => ({ name: item, tagId: generateUuid(item) }))
        const resp = await prisma.question.create({
          data: {
            questionId: generateUuid(escapedTitle),
            authorId: userResp.userId,
            title: escapedTitle,
            description: escapedDescription,
            tags: {
              create: tagsToCreate
            }
          },
        }).catch((e) => {
          console.log(e)
          throw new Error(e)
        })
        console.log('resp', resp)
        if (resp) {
          this.ctx.status = 200
          this.ctx.body = {
            questionId: resp.questionId,
            description: resp.description,
            tags
          }
        }
      } catch (err) {
        console.log('err', err)
        this.ctx.status = 500
        this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR
      }
    }
}