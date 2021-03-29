import { HttpResponse, HttpRequest } from '../../../infra/crossCutting/protocols/Index'
import { IAccountService } from '../../../interface/account/IAccountService'

export class AccountController {
  private readonly service: IAccountService
  constructor (service: IAccountService) {
    this.service = service
  }

  async login (request: HttpRequest): Promise<HttpResponse> {
    return await this.service.login(request)
  }

  async createAccount (request: HttpRequest): Promise<HttpResponse> {
    return await this.service.createAccount(request)
  }
}
