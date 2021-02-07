import { AccountModel } from '../../../../domain/model/IAccount'
import { AddAccount, AddAccountModel } from '../../../../domain/model/usecases/IAddAccount'
import { Encrypter } from '../../../crossCutting/protocols/IEncrypter'

export class AccountRepository implements AddAccount {
  private readonly encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve({
      id: 'string',
      name: 'string',
      email: 'string',
      password: 'string'
    }))
  }
}