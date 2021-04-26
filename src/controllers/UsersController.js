const UsersModel = require('../models/UsersModel')
const mongoose = require('mongoose')

class UsersContoller{
  async getUsers(req, res){
    try{
      const users = await UsersModel.find().select('name email')
      if(!users.length) return res.status(404).json({
        msg: 'No users found'
      })
      return res.status(200).json(users)
    }catch(err){
      console.log(err)
      return res.status(500).json({ msg: 'Error finding users' })
    }
  }
  async getUser(req, res){
    const { id } = req.params
    // mongoose _id ionly accepts 24 hex characters string, so we check if the id passed is valid
    if(!mongoose.isValidObjectId(id)){
      return res.status(400).json({ msg: 'Invalid id' })
    }
    try{
      const user = await UsersModel.findOne({ _id: id.toString() }).select('name email')
      if(!user) return res.status(404).json({ msg: 'User not found' })

      return res.status(200).json(user)
    }catch(err){
      console.log(err)
      return res.status(500).json({ msg: 'Error finding user' })
    }
  }
  async postUser(req, res){
    const data = {
      ...req.body
    }
    if(!Object.keys(data).length){
      return res.status(400).json({ msg: 'Fill in all fields' })
    }else{
      if(!data.name){
        return res.status(400).json({msg: 'Pass in the name'})
      }else if(!data.email){
        return res.status(400).json({msg: 'Pass in the email'})
      }else if(!data.password){
        return res.status(400).json({msg: 'Pass in the password'})
      }else if(!data.admin){
        return res.status(400).json({msg: 'Pass in the admin level'})
      }
    }
    try{
      const user = await UsersModel.create(data)
      return res.status(200).json(user)
    }catch(err){
      console.log(err)
      return res.status(500).json({ msg: 'Error creating user' })
    }
  }
  async updateUser(req, res){
    const { id } = req.params
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({
      msg: 'Invalid id'
    })
    const data = {
      ...req.body
    }
    if(!Object.keys(data).length) return res.status(200).json({
      msg: 'Nothing was updated'
    })
    try{
      const userExists = await UsersModel.findOne({ _id: id })
      if(!userExists) return res.status(404).json({ msg: 'User not found' })
    }catch(err){
      console.log(err)
    }

    try{
      const update = (await UsersModel.findOne({ _id: id })).save(data)
      return res.status(200).json({ msg: 'User updated'})
    }catch(err){
      console.log(err)
      return res.status(500).json({ msg: 'Error updating user' })
    }
  }
  async deleteUser(req, res){
    const { id } = req.params
    
    try{
      if(!await UsersModel.findOne({ _id: id })){
        return res.status(404).json({
          msg: 'User not found'
        })
      }
    }catch(err){
      console.log(err)
    }

    try{
      await UsersModel.deleteOne({ _id: id })
      return res.status(200).json({
        msg: 'User deleted'
      })
    }catch(err){
      console.log(err)
    }
  }
}
module.exports = new UsersContoller()