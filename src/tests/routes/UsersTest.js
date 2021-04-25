const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index');
const UsersModel = require('../../models/UsersModel');

chai.use(chaiHttp);
chai.should();

describe('GET users', () => {
  beforeEach(async () => {
    await UsersModel.deleteMany({});
    await UsersModel.create({
      name: 'João Vitor',
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123'
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

describe('PUT user', () => {
  beforeEach(async () => {
    await UsersModel.deleteMany({});
    user = await UsersModel.create({
      name: 'Amanda Beningna',
      email: 'amanda@outlook.com',
      password: 'LegenDary123'
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

describe('Delete user', () => {
  beforeEach(async () => {
    await UsersModel.deleteMany({});
    user = await UsersModel.create({
      name: 'João Vitor',
      email: 'joaovitor3592@gmail.com',
      password: 'LegenDary123'
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