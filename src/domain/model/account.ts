export interface UserModel {
  id: string
  name: string
  email: string
  password: string
}

export interface MakeLoginModel {
  email: string
  password: string
}

export interface MakeLogin {
  login: (user: MakeLoginModel) => Promise<UserModel>
}
