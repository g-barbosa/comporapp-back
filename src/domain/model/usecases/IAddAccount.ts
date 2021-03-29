import { AccountModel } from '../IAccount'
import { MakeLoginModel } from '../ILogin'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
  login: (login: MakeLoginModel) => Promise<MakeLoginModel>
}
