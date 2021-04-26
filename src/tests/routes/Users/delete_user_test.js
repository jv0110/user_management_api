const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../index');
const UsersModel = require('../../../models/UsersModel');

chai.use(chaiHttp);
chai.should();

describe('Delete user', () => {
  beforeEach(async () => {
    await UsersModel.deleteMany({});
    user = await UsersModel.create({
      name: 'João Vitor',
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123',
      admin: 1
    });
    const res = await chai.request(server)
    .post('/api/login')
    .send({
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123'
    });
    token = 'Bearer ' + res.body.token;
  });
  describe('Status 404', () => {
    it('if user to be deleted is not found', async () => {
      await UsersModel.deleteMany({});
      const res = await chai.request(server)
      .delete('/api/user/' + user._id)
      .set({ 'Authorization': token });
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('User not found');
    });
  });
  describe('Status 200', () => {
    it('If the user is deleted', async () => {
      const res = await chai.request(server)
      .delete('/api/user/' + user._id)
      .set({ 'Authorization': token });
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('User deleted');
    });
  });
  describe('Status 401', () => {
    it('if authorization token is not sent', (done) => {
      chai.request(server)
      .delete('/api/user/' + user._id)
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
      .delete('/api/user/' + user._id)
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
      .delete('/api/user/' + user._id)
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
describe('DELETE user(NOT ADMIN)', () => {
  beforeEach(async() => {
    await UsersModel.deleteMany();
    user = await UsersModel.create({
      name: 'João Vitor Sousa',
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123',
      admin: 2
    })
    const res = await chai.request(server)
    .post('/api/login')
    .send({
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123'
    });
    token = 'Bearer ' + res.body.token;
  });
  describe('Status 401', () => {
    it('If user does not have admin level', done => {
      chai.request(server)
      .delete('/api/user/' + user._id)
      .set({ 'Authorization': token })
      .send({})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('You do not have admin level for this');
  
        done(err);
      });
    });
  });
});