const fs = require('fs');
const axios = require("axios").default;
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const fetchAuthors = async () => {
  const promises = [];
  const authors = [];
  const quotes = JSON.parse(await loadQuotes())

  let authorsNames = quotes.map(q => q.author)

  for(author of authorsNames)
  {
    promises.push(
      axios.get('https://quotes.toscrape.com/author/' + author.replace(/[\.\s]+/g, '-'))
      .then(res => res.data)
      .then(data => {
        const jsonDom = new JSDOM(data)
        authors.push({
          name: jsonDom.window.document.querySelector('.author-title').textContent,
          biography: jsonDom.window.document.querySelector('.author-description').textContent.trim().slice(0, 50)
        })
      }).catch(err => console.log(err.message))
    )
  }
  
  return await Promise.all(promises).then(() => authors)
}

async function loadQuotes() {
  return fs.promises.readFile('./quotes.json')
}

module.exports = fetchAuthors