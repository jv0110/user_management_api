const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')

chai.use(chaiHttp)
chai.should()

describe('Index route', () => {
  describe('/GET index', () => {
    it('Returns json with the api info', (done) => {
      chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('version').eql(1.0)
        res.body.should.have.property('name').eql('Musics api')
        done(err)
      })
    })
  })
})