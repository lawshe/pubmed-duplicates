var config = require('../config.js');
var parser = require('xml2json');
var request = require('request');
var _process = require('./process-response.js');

var sendRequest = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) {
        reject(err); return;
      }
      resolve(body);
    });
  });
}

var sendRequestAndProcessArticle = (pmid, idx) => {
  var articleJson;
  var url = config.pubmed.fetch_url + pmid;
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      request(url, (err, res, body) => {
        if (err) {
          reject(err); return;
        } else {
          articleJson = parser.toJson(body, {alternateTextNode: true});
          resolve(_process.article(pmid, articleJson));
        }
      });
    }, 500*idx);
  });
}

var request = {
  sendRequest,
  sendRequestAndProcessArticle
}

module.exports = request;
