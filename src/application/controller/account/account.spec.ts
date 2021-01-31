import { EmailValidator } from '../../../infra/crossCutting/protocols'
import { AccountController } from '../account/account'
import { response } from 'express'
import { MissingParamError } from '../../../infra/crossCutting/errors'
import { MakeLogin, UserModel, MakeLoginModel } from '../../../domain/model/account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeLogin = (): MakeLogin => {
  class LoginStub implements MakeLogin {
    async login (user: MakeLoginModel): Promise<UserModel> {
      const fakeUser = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeUser))
    }
  }
  return new LoginStub()
}

interface SutTypes {
  sut: AccountController
  emailValidatorStub: EmailValidator
  loginStub: MakeLogin
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const loginStub = makeLogin()
  const sut = new AccountController(emailValidatorStub, loginStub)
  return {
    sut,
    emailValidatorStub,
    loginStub
  }
}

describe('Account Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = await sut.login(httpRequest, response)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
