const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index');
const UsersModel = require('../../models/UsersModel');

chai.use(chaiHttp);
chai.should();

describe('POST users', () => {
  beforeEach(async() => {
    await UsersModel.deleteMany();
    await UsersModel.create({
      name: 'João Vitor Sousa',
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123'
    })
    const res = await chai.request(server)
    .post('/api/login')
    .send({
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123'
    });
    token = 'Bearer ' + res.body.token;
  })
  describe('Status 200', () => {
    it('Returns 200 if the users is created', async () => {
      const data = {
        name: 'Amanda Beninga',
        email: 'amanda@outlook.com',
        password: 'Banana61789'
      };
      const res = await chai.request(server)
      .post('/api/user')
      .set({ 'Authorization': token })
      .send(data);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('name');
      res.body.should.have.property('email');
      res.body.should.have.property('password');
    });
  });
  describe('Status 400', () => {
    it('returns 400 if not data is passed at all', done => {
      chai.request(server)
      .post('/api/user')
      .set({ 'Authorization': token })
      .send({})
      .end((err ,res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Fill in all fields');
        done(err);
      });;
    });
    it('Returns 400 if name is not sent', done => {
      const data = {
        email: 'email@outlook.com',
        password: 'tortademaca'
      };
      chai.request(server)
      .post('/api/user')
      .set({ 'Authorization': token })
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Pass in the name');
        done(err);
      });
    });
    it('Returns 400 if email is not sent', done => {
      const data = {
        name: 'Algum nome',
        password: 'tortademaca'
      };
      chai.request(server)
      .post('/api/user')
      .set({ 'Authorization': token })
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Pass in the email');
        done(err);
      });
    });
    it('Returns 400 if password is not sent', done => {
      const data = {
        name: 'Um nome',
        email: 'email@outlook.com',
      };
      chai.request(server)
      .post('/api/user')
      .set({ 'Authorization': token })
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Pass in the password');
        done(err);
      });
    });
  });
  describe('Status 401', () => {
    it('if authorization token is not sent', (done) => {
      chai.request(server)
      .get('/api/users')
      .send({})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Invalid token');
        done(err);
      });
    });
    it('if token is not Bearer', (done) => {
      chai.request(server)
      .get('/api/users')
      .set({ 'Authorization': "Uchiha 123hjgn7"})
      .send({})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Invalid token type');

        done(err);
      });
    });
    it('if token value is invalid', (done) => {
      chai.request(server)
      .get('/api/users')
      .set({'Authorization': 'Bearer 3490u309j'})
      .send({})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Invalid token value');
        done(err);
      });
    });
  });
});