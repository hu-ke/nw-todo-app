import { User } from '../models/users'
import jwt from 'jsonwebtoken'
import { resBody } from '../utils'
import { secretKey } from '../global'


async function findUserByToken(token) {
  let dbUser = await User.findOne({ token })
  return dbUser
}

export default async (ctx, next) => {
  
  let token = ctx.request.header.authorization.split(' ')[1]

  // if no token provided
  if (!token) {
    ctx.status = 401
    ctx.body = resBody(-2, 'Authentication Failed: need a token to access.')
    return
  }

  let payload = await jwt.verify(token, secretKey)

  let { name } = payload

  let dbUser = (await User.findByName(name))[0]

  if (dbUser.token !== token) {
    ctx.status = 401
    ctx.body = resBody(-2, 'Authentication Failed: token is invalid or expired.')
    return
  }

  ctx.state.user = payload

  await next()
}