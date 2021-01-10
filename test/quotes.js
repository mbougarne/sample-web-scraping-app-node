const fs = require('fs')
const chai = require('chai')
const http = require('chai-http')
const app = require("../app")

const should = chai.should()
chai.use(http)

describe('Testing Queotes', () => {

  it('Should return 404 if quotes.json does not exists', done => {
    chai.request(app)
      .get('/quotes')
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it('Should return OK/200', done => {
    chai.request(app)
      .get('/quotes')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
  
  it('Body length should be larger than 0', done => {
    chai.request(app)
      .get('/quotes')
      .end((err, res) => {
        res.body.data.length.should.not.eql(0)
        done()
      })
  })
  
  it('Body should be an Object {}', done => {
    chai.request(app)
      .get('/quotes')
      .end((err, res) => {
        res.body.should.be.a('object')
        done()
      })
  })
  
  it('Body object should have data property', done => {
    chai.request(app)
      .get('/quotes')
      .end((err, res) => {
        res.body.should.have.property('data')
        done()
      })
  })

})

