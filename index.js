const fs = require('fs');
const http = require('http');
const URL = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

//http server
//================================//

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template.html`, 'utf-8');

const fileData = fs.readFileSync('./dev-data/data.json', 'utf-8');
const data = JSON.parse(fileData);

const IP = '127.0.0.1';

const server = http.createServer((req, res) => {
  const { query, pathname } = URL.parse(req.url, true);

  //overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = data.map((item) => replaceTemplate(tempCard, item)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //product
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = data[query.id];
    const output = replaceTemplate(tempProduct, product);
    return res.end(output);

    //not found
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    return res.end(`<h1 style="display: flex; justify-content: center; align-items: center; height:100%">URL NOT FOUND!</h1>`);
  }
});

server.listen(5000, IP, () => {
  console.log('Server is listening requests on port 5000');
});

//==============================//
