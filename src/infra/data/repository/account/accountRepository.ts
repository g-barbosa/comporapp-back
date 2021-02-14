import { AccountModel } from '../../../../domain/model/IAccount'
import { AddAccount, AddAccountModel } from '../../../../domain/model/usecases/IAddAccount'
import { Encrypter } from '../../../crossCutting/protocols/Index'
import { IAccountRepository } from '../../interface/IAccountRepository'

export class AccountRepository implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: IAccountRepository
  constructor (encrypter: Encrypter, addAccountRepository: IAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  };
}
