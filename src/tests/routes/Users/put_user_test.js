const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../index');
const UsersModel = require('../../../models/UsersModel');

chai.use(chaiHttp);
chai.should();

describe('PUT user', () => {
  beforeEach(async () => {
    await UsersModel.deleteMany({});
    user = await UsersModel.create({
      name: 'Amanda Beningna',
      email: 'amanda@outlook.com',
      password: 'LegenDary123',
      admin: 1
    });
    const res = await chai.request(server)
    .post('/api/login')
    .send({
      email: 'amanda@outlook.com',
      password: 'LegenDary123'
    });
    token = 'Bearer ' + res.body.token;
  })
  describe('Status 400', () => {
    it('Returns 400 if the id passed is not a 24 hex string', done => {
      chai.request(server)
      .put('/api/user/12')
      .set( { 'Authorization': token })
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Invalid id');
        done(err);
      });
    });
  });
  describe('Status 404', () => {
    it('Returns 404 if the user is not found', async () => {
      await UsersModel.deleteMany();
      const res = await chai.request(server)
      .put('/api/user/' + user._id)
      .set( { 'Authorization': token })
      .send({
        name: 'Name'
      });
      res.should.have.status(404);
      res.body.should.be.a('object');
    });
  });
  describe('Status 200', () => {
    it('if nothing was sent, meaning that nothing was updated', async () => {
      const res = await chai.request(server)
      .put('/api/user/' + user._id)
      .set( { 'Authorization': token })
      .send({});
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('Nothing was updated');
    });
    it('if mongoose does not try to update a property that does not exists', async () => {
      const res = await chai.request(server)
      .put('/api/user/' + user._id)
      .set( { 'Authorization': token })
      .send({
        prop: 'value'
      });
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('User updated');
    });
    it('if the user name is successfuly updated', async () => {
      const res = await chai.request(server)
      .put('/api/user/' + user._id)
      .set( { 'Authorization': token })
      .send({
        name: 'mano do ceu'
      });
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('User updated');
    });
    it('if the user email is successfuly updated', async () => {
      const res = await chai.request(server)
      .put('/api/user/' + user._id)
      .set( { 'Authorization': token })
      .send({
        email: 'email@outlook.com'
      });
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('User updated');
    });
    it('if the user password is successfuly updated', async () => {
      const res = await chai.request(server)
      .put('/api/user/' + user._id)
      .set( { 'Authorization': token })
      .send({
        password: 'EuAdoroTorta'
      });
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('User updated');
    });
  });
  describe('Status 401', () => {
    it('if authorization token is not sent', (done) => {
      chai.request(server)
      .put('/api/user/' + user._id)
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
      .put('/api/user/' + user._id)
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
      .put('/api/user/' + user._id)
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
describe('PUT user(NOT ADMIN)', () => {
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
      .put('/api/user/' + user._id)
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