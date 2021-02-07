import { Response } from 'express'
import { badRequest, ok, serverError } from '../../../infra/crossCutting/helpers/httpHelpers'
import { InvalidParamError, MissingParamError } from '../../../infra/crossCutting/errors'
import { EmailValidator, HttpResponse, HttpRequest } from '../../../infra/crossCutting/protocols'
import { MakeLogin } from '../../../domain/model/login'
import { AddAccount } from '../../../domain/model/usecases/addAccount'

export class AccountController {
  private readonly emailValidator: EmailValidator
  private readonly makeLogin: MakeLogin
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, makeLogin: MakeLogin, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.makeLogin = makeLogin
    this.addAccount = addAccount
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
      return serverError()
    }
  }

  async createAccount (httpRequest: HttpRequest, response: Response): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
