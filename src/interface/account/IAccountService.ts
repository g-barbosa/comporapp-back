import { HttpRequest, HttpResponse } from '../../infra/crossCutting/protocols'

export interface IAccountService {
  login: (request: HttpRequest) => Promise<HttpResponse>
  createAccount: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
