import { User } from '../models/users'
import jwt from 'jsonwebtoken'
import { resBody } from '../utils'
import { secretKey } from '../global'
import md5 from 'blueimp-md5'

function getMaxUserId() {
  return new Promise((resolve, reject) => {
    User.findOne().sort('-id').exec(function(err, user) {
      // user.id is the max value
      if (!user || !user.id) {
        resolve(1)
        return
      }
      resolve(user.id)
    })
  })
}

async function saveUser(user) {
  let resUser = await user.save()
  return resUser
}

function findByName(name) {
  return new Promise((resolve, reject) => {
    User.findByName(name, (err, doc) => {
      if (err) {
        console.log(err)
      }
      resolve(doc[0])
    })
  })
}

async function updateUserToken(name, token) {
  let data = await User.findOneAndUpdate({ name }, {$set: {
    token,
  }}, {
    upsert: true // if no token, then add token
  })
  return data
}

class UsersController {
  async deleteAllUsers(ctx) {
    let res = await User.find({}).remove()
    ctx.body = resBody(0, 'remove Successfully', null) 
  }
  async login(ctx) {
    let { name, password } = ctx.request.body
    let dbUser = await findByName(name)
    if (!dbUser || md5(ctx.request.body.password) !== dbUser.password) {
      ctx.status = 401
      ctx.body = resBody(-2, 'Authentication Failed: user not exists or wrong password.')
      return
    }

    ctx.status = 200

    let token = jwt.sign({
      id: dbUser.id, 
      name: dbUser.name, 
      password: dbUser.password,
    }, secretKey) // Store this key in an environment variable

    let data = {
      token,
      name: dbUser.name,
    }
    await updateUserToken(name, token)

    ctx.body = resBody(0, 'Successful Authentication', data) 
  }

  async register(ctx) {
    let { name, password } = ctx.request.body
    let dbUser = await findByName(name)
    if (dbUser && dbUser.name) {
      ctx.body = resBody(-1, 'Registration Failed: username already exists.')
      return
    }
    let maxId = await getMaxUserId()
    let user = new User({
      id: maxId + 1,
      name,
      password: md5(password)
    })
    let res = await saveUser(user)
    ctx.body = resBody(0, 'Successful Registration', res)
  }
}

export default new UsersController()