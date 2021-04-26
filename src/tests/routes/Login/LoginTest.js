const chai = require('chai')
const request = require('chai-http')
const server = require('../../../../index')
const UsersModel = require('../../../models/UsersModel')

chai.use(request)
chai.should()

describe('/Login', () => {
  describe('Status 400', () => {
    it('if no data is sent', (done) => {
      chai.request(server)
      .post('/api/login')
      .send({})
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('msg').eql('Fill in all fields')
        done(err)
      })
    })
    it('if the email is not sent', (done) => {
      const data = {
        password: 'LegenDary123'
      }
      chai.request(server)
      .post('/api/login')
      .send(data)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('msg').eql('Pass in the email')
        done(err)
      })
    })
    it('if the password is not sent', (done) => {
      const data = {
        email: 'joaovitor3592@gmail.com'
      }
      chai.request(server)
      .post('/api/login')
      .send(data)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('msg').eql('Pass in the password')
        done(err)
      })
    })
  })
  describe('Status 404', () => {
    beforeEach(async() => {
      await UsersModel.deleteMany({})
    })
    it('If the email is not found in the database', async () => {
      const data = {
        name: 'João Vitor',
        email: 'joaovitor3592@gmail.com',
        password: 'LegenDary123'
      }
      const res = await chai.request(server).post('/api/login').send(data)
      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('msg').eql('User not found')
    })
  })
  describe('Status 401', () => {
    it('if the passwords does not match', async() => {
      await UsersModel.create({
        name: 'João Vitor',
        email: 'joaovitor3592@gmail.com',
        password: 'LegenDary123'
      })
      const res = await chai.request(server).post('/api/login').send({
        email: 'joaovitor3592@gmail.com',
        password: 'UmaTorta123'
      })
      res.should.have.status(401)
      res.body.should.be.a('object')
      res.body.should.have.property('msg').eql("Wrong password")
    })
  })
  describe('Status 200', () => {
    beforeEach(async () => {
      await UsersModel.deleteMany({})
      await UsersModel.create({
        name: 'João Vitor',
        email: 'joaovitor3592@gmail.com',
        password: 'LegenDary123'
      })
    })
    it('if the user logs in and a tokens is returned', async () => {
      const res = await chai.request(server)
      .post('/api/login')
      .send({
        email: 'joaovitor3592@gmail.com',
        password: 'LegenDary123'
      })
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('token')
    })
  })
})

