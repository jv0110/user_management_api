const express = require('express')
const router = express.Router()
const UsersContoller = require('../controllers/UsersController')
const authToken = require('../middlewares/valToken');

router.get('/users', UsersContoller.getUsers)
router.get('/user/:id', UsersContoller.getUser)
router.post('/user', authToken, UsersContoller.postUser)
router.put('/user/:id', authToken, UsersContoller.updateUser)
router.delete('/user/:id', authToken, UsersContoller.deleteUser)

module.exports = app => app.use('/api', router)