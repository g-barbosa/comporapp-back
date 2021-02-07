export interface MakeLoginModel {
  email: string
  password: string
}

export interface MakeLogin {
  login: (user: MakeLoginModel) => Promise<MakeLoginModel>
}
