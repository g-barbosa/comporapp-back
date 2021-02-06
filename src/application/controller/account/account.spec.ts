import { EmailValidator } from '../../../infra/crossCutting/protocols'
import { AccountController } from '../account/account'
import { response } from 'express'
import { MissingParamError, InvalidParamError, ServerError } from '../../../infra/crossCutting/errors'
import { MakeLogin, MakeLoginModel } from '../../../domain/model/account'

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
    async login (user: MakeLoginModel): Promise<MakeLoginModel> {
      const fakeUser = {
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
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.login(httpRequest, response)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.login(httpRequest, response)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.login(httpRequest, response)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    await sut.login(httpRequest, response)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse = await sut.login(httpRequest, response)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call MakeLogin with correct values', async () => {
    const { sut, loginStub } = makeSut()
    const addSpy = jest.spyOn(loginStub, 'login')

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    await sut.login(httpRequest, response)
    expect(addSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if MakeLogin throws', async () => {
    const { sut, loginStub } = makeSut()
    jest.spyOn(loginStub, 'login').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.login(httpRequest, response)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.login(httpRequest, response)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
