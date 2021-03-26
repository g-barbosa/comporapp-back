import { AddAccountModel } from '../../../../../domain/model/usecases/IAddAccount'
import { IAccountRepository } from '../../../interface/IAccountRepository'
import { AccountModel } from '../../../../../domain/model/IAccount'
import { MongoHelper } from '../../../helpers/mongoHelper'

export class AccountMongoRepository implements IAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }
}