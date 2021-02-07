import { AccountModel } from '../../../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../../../domain/model/usecases/addAccount'
import { Encrypter } from '../../../crossCutting/protocols/encrypter'

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
