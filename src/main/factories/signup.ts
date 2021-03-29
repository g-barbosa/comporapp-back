import { AccountController } from '../../application/controller/account/AccountController'
import { AccountService } from '../../service/account/AccountService'
import { EmailValidatorAdapter } from '../../infra/crossCutting/utils/validator/EmailValidatorAdapter'
import { AccountRepository } from '../../infra/data/repository/account/accountRepository'
import { BCryptAdapter } from '../../infra/crossCutting/utils/criptography/bcryptAdapter'
import { AccountMongoRepository } from '../../infra/data/repository/mongodb/account/account'

export const makeAccountController = (): AccountController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const accountRepository = new AccountRepository(bcryptAdapter, accountMongoRepository)
  const accountService = new AccountService(emailValidatorAdapter, accountRepository)

  return new AccountController(accountService)
}
