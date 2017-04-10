var fs = require('fs');
var config = require('../config.js');
var _requests = require('./send-requests.js');

var createFile = (cb) => {
  console.log('... creating article PMID list');
  var totalCount;
  var articleList;
  var pubMedListUrl = config.pubmed.search_url + '&retmode=json&term=' + config.journal.name + '+' + config.journal.issn;

  return new Promise((resolve, reject) => {
    _requests.sendRequest(pubMedListUrl + '&retmax=1').then((requestResult) => {
      totalCount = getTotalPublicationCount(requestResult);
      if (totalCount) {
        _requests.sendRequest(pubMedListUrl + '&retmax=' + totalCount).then((requestTwoResult) => {
          articleList = getList(requestTwoResult);
          console.log(articleList.length);
          if (articleList) {
            saveFile(articleList, function(result){
              resolve(true);
            })
          }
        });
      }
    });
  });
}

var getList = (response) => {
  response = JSON.parse(response);
  var list;
  if (response && response.esearchresult && response.esearchresult.idlist) {
    list = response.esearchresult.idlist
  }
  return list;
}

var getTotalPublicationCount = (response) => {
  response = JSON.parse(response);
  var count;
  if (response && response.esearchresult) {
    count = response.esearchresult.count
  }
  return count;
}

var saveFile = (ids, cb) => {
  var filePath = './data/' + config.journal.name.toLowerCase() + '.js';
  var fileData = 'var articles = {\n\tids: [\n\t\t' + ids + '\n]\n};\n\nmodule.exports = articles;'

  fs.writeFile(filePath, fileData, function(err) {
    if(err) {
      return console.log(err);
    } else {
      console.log('Saved article PMID file in ' + filePath);
      cb(true);
    }
  });
}

var createArticlesList = {
  createFile,
  getList,
  getTotalPublicationCount,
  saveFile
}

module.exports = createArticlesList;
