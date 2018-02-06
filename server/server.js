import Router from 'koa-router'
import Koa from 'koa'
import mongoose from 'mongoose'
import koaBody from 'koa-body'

import { cors, jwt, authenticate } from './middlewares'
import { tasksController, usersController } from './controllers'
import { port, connectionString } from './global'

mongoose.connect(connectionString);
mongoose.connection.on('error', console.error);

const app = new Koa()
app.use(cors)

const router = new Router()

// the sequence is important: https://stackoverflow.com/questions/22148087/request-body-is-undefined-in-koa
app.use(koaBody())
app.use(router.routes())

router.get('/getTaskLists', jwt, authenticate, tasksController.findTaskLists)

router.post('/updateTaskList', jwt, authenticate, tasksController.updateTaskList)

router.post('/register', usersController.register)

router.post('/login', usersController.login)

// router.post('/deleteUsers', usersController.deleteAllUsers)

// router.post('/deleteTaskLists', tasksController.deleteAllTaskLists)

if (!module.parent) app.listen(port)

export default app