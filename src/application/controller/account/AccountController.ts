import { Response } from 'express'
import { HttpResponse, HttpRequest } from '../../../infra/crossCutting/protocols/Index'
import { IAccountService } from '../../../interface/account/IAccountService'

export class AccountController {
  private readonly service: IAccountService
  constructor (service: IAccountService) {
    this.service = service
  }

  async login (request: HttpRequest, response: Response): Promise<HttpResponse> {
    return await this.service.login(request, response)
  }

  async createAccount (request: HttpRequest, response: Response): Promise<HttpResponse> {
    return await this.service.createAccount(request, response)
  }
}
