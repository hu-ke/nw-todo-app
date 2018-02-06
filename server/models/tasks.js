import mongoose from 'mongoose'

const { Schema } = mongoose

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise

const taskSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  type: String,
  name: String,
  active: Boolean,
  content: String,
})
.set('toObject', {
  transform: function (doc, ret) {
    delete ret._id
    delete ret.__v
  }
})


var listSchema = new Schema({
  // Array of subdocuments
  taskList1: {
    type: [taskSchema],
  },
  taskList2: {
    type: [taskSchema],
  },
  taskList3: {
    type: [taskSchema]    
  },
  userId: {
    type: Number,
    required: true
  }
})
.set('toObject', {
  transform: function (doc, ret) {
    delete ret._id
    delete ret.__v
  }
})

export const Task = mongoose.model('Task', taskSchema)
export const TaskList = mongoose.model('TaskList', listSchema)
