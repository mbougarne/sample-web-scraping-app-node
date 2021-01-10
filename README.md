# Welcome

A sample web scraping app with Node and Express

## Stack

- **Language:** JavaScript
- **Back-end:** NodeJS(as a runtime), Express(web server)
- **Testing:** Mocha and Chai
- **Scrapping Tool:** JSDOM, Axios

### Instruction

The first thing app do is scrapping all data from the public API, for that you should firstly access it via ```/quotes``` **endpoint**, if you try with other **endpoints** you'll get an 404 error.

To use the app:

```sh
git clone https://github.com/mbougarne/sample-web-scraping-app-node.git
npm i
npm start
```

### Routes

| Method  | Path             | Description                                                     |
|---------|-------------------|--------------------------------------------------------------- |
| GET     | /quotes           | If the quotes didn't scrapped yet, scrappe them or return them |
| GET     | /quotes/a/:author | Get all quotes of the givin author or return 404 if not exists |
| GET     | /quotes/t/:tag    | Get all quotes of the givin tag, it won't return 404           |
| GET     | /authors          | Get all authors of the quotes that we scrapped                 |
| GET     | /authors/:name    | Get author details based on it's name, or 404 if not exists    |

