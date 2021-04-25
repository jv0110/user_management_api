const mongoose = require('../database/db')
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 10,
    max: 100
  },
  password: {
    type: String,
    required: true,
    min: 10,
    max: 255
  },
  admin: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
});
UserSchema.pre('save', async function (next){
  const user = this;
  const salt = await bcrypt.genSaltSync(11);
  const hash = await bcrypt.hashSync(user.password, salt)

  user.password = hash;
  next()
})
const UsersModel = mongoose.model('users', UserSchema);
module.exports = UsersModel
