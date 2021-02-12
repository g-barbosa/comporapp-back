import { AddAccountModel } from '../../../../domain/model/usecases/IAddAccount'
import { IAccountRepository } from '../../../crossCutting/protocols/IAccountRepository'
import { AccountModel } from '../../../../domain/model/IAccount'
import { MongoHelper } from '../helpers/helper'

export class AccountMongoRepository implements IAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]
    const { _id, ...accountWithoutId } = account
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
