import { badRequest, ok, serverError } from '../../infra/crossCutting/helpers/HttpHelpers'
import { InvalidParamError, MissingParamError } from '../../infra/crossCutting/errors'
import { EmailValidator, HttpResponse, HttpRequest } from '../../infra/crossCutting/protocols'
import { AddAccount } from '../../domain/model/usecases/IAddAccount'
import { IAccountService } from '../../interface/account/IAccountService'

export class AccountService implements IAccountService {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async login (request: HttpRequest): Promise<HttpResponse> {
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

      const loginInformations = await this.addAccount.login({
        email,
        password
      })

      return ok(loginInformations)
    } catch (err) {
      return serverError()
    }
  };

  async createAccount (httpRequest: HttpRequest): Promise<HttpResponse> {
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
  };
}
