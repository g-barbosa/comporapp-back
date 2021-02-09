import { AddAccountModel } from '../../../domain/model/usecases/IAddAccount'
import { AccountModel } from '../../../domain/model/IAccount'

export interface IAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
