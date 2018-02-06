import { TaskList } from '../models/tasks'
import { User } from '../models/users'
import { resBody } from '../utils'

async function findTaskListsByUserId(userId) {
  return await TaskList.findOne({ userId })
}

class TasksController {
  // async deleteAllTaskLists(ctx) {
  //   let res = await TaskList.find({}).remove()
  //   ctx.body = resBody(0, 'remove Successfully', null) 
  // }
  /**
   * Get all tasks
   * @param {ctx} Koa Context
  */
  async findTaskLists(ctx) {
    let user = ctx.state.user
    let taskLists = await findTaskListsByUserId(user.id)
      // .select('-__v').select('-_id') // '-' means exclude the field

    ctx.body = taskLists || {}
  }

  async updateTaskList(ctx) {
    let user = ctx.state.user

    let userId = user.id
    let { type, taskList } = ctx.request.body

    let setMap = null
    if (type === 'TODO') {
      setMap = {
        $set: {
          'taskList1': taskList
        }
      }
    } else if (type === 'COMPLETED') {
      setMap = {
        $set: {
          'taskList2': taskList
        }
      }
    } else if (type === 'DELETED') {
      setMap = {
        $set: {
          'taskList3': taskList
        }
      }
    }
    if (!setMap) {
      ctx.body = 'Something wrong when updating data!'
      return
    }

    let res = await TaskList.findOneAndUpdate({ userId }, setMap, {
      upsert: true
    })

    ctx.body = res
  }

  // async saveTaskLists(ctx) {
  //   const task = await new TaskList(ctx.request.body).save();
  //   ctx.body = task;
  // }
}

export default new TasksController()