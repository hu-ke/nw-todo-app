import mongoose from 'mongoose'

const { Schema } = mongoose

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise

const userSchema = new Schema({
  id: {
    type: Number,
    require: true,
  },
  name: String,
  password: String,
  token: String,
})
.set('toObject', {
  transform: function (doc, ret) {
    delete ret._id
    delete ret.__v
  }
})
 
userSchema.statics.findByName = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
}

export const User = mongoose.model('User', userSchema)