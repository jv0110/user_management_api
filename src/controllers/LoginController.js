const UsersModel = require('../models/UsersModel')
const jwt = require('../helpers/jwtCreate')
const bcrypt = require('bcryptjs')

class Login{
  async login(req, res){
    const data = {
      ...req.body
    }
    if(!Object.keys(data).length){
      return res.status(400).json({
        msg: 'Fill in all fields'
      })
    }else{
      if(!data.email){
        return res.status(400).json({
          msg: 'Pass in the email'
        })
      }else if(!data.password){
        return res.status(400).json({
          msg: 'Pass in the password'
        })
      }
    }

    let user = {}
    try{
      user = await UsersModel.findOne({ email: data.email })
      if(!user) return res.status(404).json({
        msg: 'User not found'
      })
    }catch(err){
      console.log(err)
    }
    if(!bcrypt.compareSync(data.password, user.password)){
      return res.status(401).json({
        msg: 'Wrong password'
      })
    }
    const access_token = jwt({
      _id: user._id,
      email: user.email
    })
    return res.status(200).json({
      token: access_token
    })
  }
}
module.exports = new Login();