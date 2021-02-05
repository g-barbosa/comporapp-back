import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'

const GenPassHash = (password: string): string => {
  const salt = bcrypt.genSaltSync()

  return bcrypt.hashSync(password, salt)
}

const GentToken = async (entityId: string, login: string): Promise<string> => {
  const now = Math.floor(Date.now() / 100)

  const userInfo = {
    entityId: entityId,
    login: login,
    iat: now + (3 * 24 * 60 * 60)
  }

  const authSecret: string = process.env.APP_AUTH_SECRET ?? ''

  return jwt.encode(userInfo, authSecret)
}

export { GenPassHash, GentToken }
