const fs = require('fs')
const chai = require('chai')
const http = require('chai-http')
const app = require("../app")

const should = chai.should()
chai.use(http)

describe('Testing Authors', () => {

  it('Should return 404 if quotes.json does not exists', done => {
    chai.request(app)
      .get('/authors')
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it('Should return 404 if author does not exists', done => {
    chai.request(app)
      .get('/quotes/a/John Doe')
      .end( (err, res) => {
        res.should.have.status(404)
        done()
      })
  })

  it('Should return 200/OK if quotes.json file exists', done => {
    chai.request(app)
      .get('/quotes/a/Marilyn Monroe')
      .end( (err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it('Should have author, text, and tags properties', done => {
    chai.request(app)
      .get('/quotes/a/Marilyn Monroe')
      .end( (err, res) => {
        res.body.should.be.a('object')
        res.body.data.should.be.a('array')
        res.body.data[0].should.have.property('author')
        res.body.data[0].should.have.property('text')
        res.body.data[0].should.have.property('tags')

        done()
      })
  })
})

