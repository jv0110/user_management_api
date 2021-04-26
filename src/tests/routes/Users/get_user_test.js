const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index');
const UsersModel = require('../../models/UsersModel');

chai.use(chaiHttp);
chai.should();

describe('GET user:id', () => {
  beforeEach(async () => {
    await UsersModel.deleteMany({});
    user = await UsersModel.create({
      name: 'João Vitor',
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123'
    });
  });
  describe('Status 400', () => {
    it('Returns 400 if the id is invalid', (done) => {
      chai.request(server)
      .get('/api/user/12')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.include.property('msg').eql('Invalid id');
        done(err);
      });
    });
  });
  describe('Status 200', () => {
    it('Returns 200 if a user is returned', async () => {
      const res = await chai.request(server)
      .get(`/api/user/${user._id}`)
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.include.property('name');
      res.body.should.include.property('email');
    });
  });
  describe('Status 404', () => {
   it('Returns 404 if the user is not found', async () => {
      await UsersModel.deleteMany({})
      const res = await chai.request(server)
      .get('/api/user/' + user._id)
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.include.property('msg').eql('User not found');
    });
  });
});