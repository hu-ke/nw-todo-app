import jwt from 'koa-jwt'
import { secretKey } from '../global'

export default jwt({
  secret: secretKey
});
