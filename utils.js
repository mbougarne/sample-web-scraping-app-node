const successResponse = (res, data) => {
  return res.status(200).json(data)
}

const failureResponse = (res, data) => {
  return res.status(404).json(data)
}

const loadQuotes = (fs, res) => {
  fs.readFile('./quotes.json', (err, data) => {
    if(err)
    {
      failureResponse(res, {
        success: false,
        status: 404,
        statusText: 'Not Found',
        message: err.message
      })
    } else {
      successResponse(res, {
        data: JSON.parse(data)
      })
    }
  })
}

module.exports = {
  successResponse,
  failureResponse,
  loadQuotes
}