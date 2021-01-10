// requests library
const fs = require('fs')
const express = require("express")
const axios = require("axios").default
const jsdom = require("jsdom")
const cors = require('cors')

const { JSDOM } = jsdom

const fetchData = require('./fetchQuotes')
const fetchAuthors = require('./fetchAuthors')
const { loadQuotes, failureResponse, successResponse } = require('./utils')

const app = express()

app.use(cors())

// GET all available quotes
app.get('/quotes', async (req, res) => {
  if(!fs.existsSync('./quotes.json'))
  {
    await fetchData()
    return loadQuotes(fs, res)
  } else {
    return loadQuotes(fs, res)
  }
})

// GET all quotes by a particular author
app.get('/quotes/a/:author', (req, res) => {
  if(!fs.existsSync('./quotes.json'))
  {
    return failureResponse(res, { data: {
      success: false,
      status: 404,
      statusText: 'Not Found',
      message: 'You should load the quotes first by going to /quotes'
    }})
  }

  let author = req.params.author.replace('-', ' ').toLowerCase()

  return fs.readFile('./quotes.json', (err, data) => {
    if(err)
    {
      return failureResponse(res, { data: {
        success: false,
        status: 404,
        statusText: 'File Not Found',
        message: `${err.code} | ${err.errno} | ${err.message}`
      }})
    }

    let quotes = JSON.parse(data)
    let authorExists = quotes.findIndex(q => q.author.toLowerCase() === author)

    if(authorExists === -1)
    {
      return failureResponse(res, {
        data: {
          success: false,
          status: 404,
          statusText: 'Not Found',
          message: "Author not found"
        }
      })
    }
    
    let authorQuotes = quotes.filter(q => q.author.toLowerCase() === author)
    successResponse(res, {
      data: authorQuotes
    });
  })
})

// GET all quotes with a specific tag
app.get('/quotes/t/:tag', (req, res) => {
  if(!fs.existsSync('./quotes.json'))
  {
    return failureResponse(res, { data: {
      success: false,
      status: 404,
      statusText: 'Not Found',
      message: 'You should load the quotes first by going to /quotes'
    }})
  }

  let tag = req.params.tag.toLowerCase()

  return fs.readFile('./quotes.json', (err, data) => {
    if(err)
    {
      return failureResponse(res, { data: {
        success: false,
        status: 404,
        statusText: 'File Not Found',
        message: `${err.code} | ${err.errno} | ${err.message}`
      }})
    }

    let quotes = JSON.parse(data)
    let tagQuotes = quotes.filter(q => q.tags.includes(tag))

    successResponse(res, {
      data: tagQuotes
    });
  })
})

// biographical information for all authors
app.get('/authors', async (req, res) => {
  if(!fs.existsSync('./quotes.json'))
  {
    return failureResponse(res, { data: {
      success: false,
      status: 404,
      statusText: 'Not Found',
      message: 'You should load the quotes first by going to /quotes'
    }})
  }
  
  const authors = await fetchAuthors()
  
  successResponse(res, {
    data: {
      authors
    }
  })
})

// biographical information for one author
app.get('/authors/:name', (req, res) => {
  
  axios.get('https://quotes.toscrape.com/author/' + req.params.name)
    .then(res => res.data)
    .then(data => {
      const jsonDom = new JSDOM(data);
      return successResponse(res, {
        data: [{
          name: jsonDom.window.document.querySelector('.author-title').textContent,
          biography: jsonDom.window.document.querySelector('.author-description').textContent.trim().slice(0, 50)
        }]
      })
    }).catch(err => failureResponse(res, {
      data: [
        {
          status: 404,
          statusText: "Not Found",
          message: err.message
        }
      ]
    }))
})

module.exports = app; 