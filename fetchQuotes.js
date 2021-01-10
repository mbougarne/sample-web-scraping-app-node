const fs = require('fs');
const axios = require("axios").default;
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const fetchQuotes = async () => {
  const promises = [];
  const quotes = [];

  for(let page = 1; page < 11; page++)
  {
    promises.push(
      axios.get('https://quotes.toscrape.com/page/' + page)
      .then(res => res.data)
      .then(data => {
        const jsonDom = new JSDOM(data)
        const quotesDom = jsonDom.window.document.querySelectorAll('.quote')

        quotesDom.forEach(item => {
          let quote = {
            author: '',
            text: '',
            tags: [],
          };

          quote.author = item.querySelector('.author').textContent
          quote.text = item.querySelector('.text').textContent
          item.querySelectorAll('.tag').forEach(tag => quote.tags.push(tag.textContent))

          quotes.push(quote)
        })
      }).catch(err => console.log(err.message))
    )
  }

  await Promise.all(promises).then(() => {
    fs.writeFile('quotes.json', JSON.stringify(quotes), error => {
      if(error) {
        console.log(error.message)
      }
      console.log('Quotes fetched!')
    })
  })
}

module.exports = fetchQuotes