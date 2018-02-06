import app from '../server.js'
import supertest from 'supertest'
import { expect, should } from 'chai'

const temp = {}
const request = supertest.agent(app.listen())
should()

describe('POST /register', () => {
  it('should add a user', done => {
    request
      .post('/register')
      .set('Accept', 'application/json')
      .send({
        name: 'name1',
        password: 'password1'
      })
      .expect(200, (err, res) => {
        console.log(res.body)
        done()
      })
  })
})

describe('POST /login', () => {
  it('should get a token', done => {
    request
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        name: 'name1',
        password: 'password1'
      })
      .expect(200, (err, res) => {
        console.log(res.body)
        if (res.body.data) {
          temp['token'] = res.body.data.token
        }
        done()
      })
  })
})

describe('POST /updateTaskList', () => {
  it('should update taskList', done => {
    request
      .post('/updateTaskList')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${temp.token}`)
      .send({
        type: 'TODO',
        taskList: [
          {
            id: 1,
            type: 'TODO',
            name: 'task1',
            active: true,
            content: 'my task1',
          }, {
            id: 2,
            type: 'TODO',
            name: 'task2',
            active: false,
            content: 'my task2',
          }, {
            id: 3,
            type: 'TODO',
            name: 'task3',
            active: false,
            content: 'my task3',
          }
        ]
      })
      .expect(200, (err, res) => {
        console.log(res.body)
        done()
      })
  })
})

describe('GET /getTaskLists', () => {
  it('should get all task lists', done => {
    request
      .get('/getTaskLists')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${temp.token}`)
      .send()
      .expect(200, (err, res) => {
        console.log(res.body)
        done()
      })
  })
})

// describe('POST /deleteUsers', () => {
//   it('should delete all users', done => {
//     request
//       .post('/deleteUsers')
//       .send()
//       .expect(200, (err, res) => {
//         done()
//       })
//   })
// })

// describe('POST /deleteTaskLists', () => {
//   it('should delete all task lists', done => {
//     request
//       .post('/deleteTaskLists')
//       .send()
//       .expect(200, (err, res) => {
//         done()
//       })
//   })
// })

