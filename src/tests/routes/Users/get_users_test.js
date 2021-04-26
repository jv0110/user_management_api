const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../index');
const UsersModel = require('../../../models/UsersModel');

chai.use(chaiHttp);
chai.should();

describe('GET users', () => {
  beforeEach(async () => {
    await UsersModel.deleteMany({});
    await UsersModel.create({
      name: 'João Vitor',
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123',
      admin: 1
    });
  });
  describe('Status 404', () => {
    it('returns 404 if no users are found', async () => {
      await UsersModel.deleteMany({});
      const res = await chai
      .request(server)
      .get('/api/users')

      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('msg').eql('No users found');
    });
  });
  describe('Status 200', () => {
    it('returns 200 if users are found', async () => {
      const res = await chai
      .request(server)
      .get('/api/users')

      res.should.have.status(200);
      res.body.should.be.a('array');
    });
  });
});