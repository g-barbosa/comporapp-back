import { HttpRequest, HttpResponse } from '../../infra/crossCutting/protocols'
import { Response } from 'express'

export interface IAccountService {
  login: (request: HttpRequest, response: Response) => Promise<HttpResponse>
  createAccount: (httpRequest: HttpRequest, response: Response) => Promise<HttpResponse>
}
