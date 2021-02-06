import { Response } from 'express'
import { badRequest, ok, serverError } from '../../../infra/crossCutting/helpers/httpHelpers'
import { InvalidParamError, MissingParamError } from '../../../infra/crossCutting/errors'
import { EmailValidator, HttpResponse, HttpRequest } from '../../../infra/crossCutting/protocols'
import { MakeLogin } from '../../../domain/model/account'

export class AccountController {
  private readonly emailValidator: EmailValidator
  private readonly makeLogin: MakeLogin

  constructor (emailValidator: EmailValidator, makeLogin: MakeLogin) {
    this.emailValidator = emailValidator
    this.makeLogin = makeLogin
  }

  async login (request: HttpRequest, response: Response): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = request.body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const loginInformations = await this.makeLogin.login({
        email,
        password
      })

      return ok(loginInformations)
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }
}
