import { AddAccountModel } from '../../../domain/model/usecases/IAddAccount'
import { AccountModel } from '../../../domain/model/IAccount'
import { MakeLoginModel } from '../../../domain/model/ILogin'

export interface IAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
  login: (login: MakeLoginModel) => Promise<MakeLoginModel>
}
