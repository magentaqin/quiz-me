import { Controller } from 'egg';
import userErrorCodes from '../error_codes/user'
import globalErrorCodes from '../error_codes/global'
import { hashPassword, generateUserId } from '../utils/hash'
import { jwtSign } from '../utils/jwt'

export default class UserController extends Controller {
  public async signup() {
    try {
      const { prisma } = this.app
      const { email, userName, password } = this.ctx.request.body
      if (!email || !userName || !password) {
        this.ctx.status = 400
        this.ctx.body = globalErrorCodes.REQUIRED_PARAMETERS_NOT_PROVIDED
        return
      }
      // 01 check whether user existed
      const userResp = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (userResp) {
        this.ctx.status = 409
        this.ctx.body = userErrorCodes.USER_ALRREADY_EXIST
        return
      }
      // 02 check wheter username duplicated
      const userNameResp = await prisma.user.findUnique({
        where: {
          userName,
        }
      })
      if (userNameResp) {
        this.ctx.status = 409
        this.ctx.body = userErrorCodes.USER_NAME_DUPLICATE
        return
      }
      // 03 Hash Password with salt
      const hashedPassword = await hashPassword(password)
      // 04 JWT Sign token
      const userId = generateUserId(userName)
      const token = jwtSign({ userId })
      // 05 Create User
      await prisma.user.create({
        data: {
          email,
          userId,
          userName,
          password: hashedPassword,
        },
      })

      this.ctx.status = 201
      this.ctx.body = {
        token,
        userName,
        userId
      }

    } catch(err) {
      this.ctx.status = 500
      this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR
    }
  }

  public async login() {

  }
}