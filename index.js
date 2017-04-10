var config = require('./config.js');
var fs = require('fs');
var _createArticlesList = require('./js/create-articles-list.js');
var _requests = require('./js/send-requests.js');
var articleList; // created or imported below in getArticleMetadata()
var articleIdsPath;

// Get Article Metadata
var getArticleMetadata = (articleIdsPath) => {
  var promises = [];
  articleList = require(articleIdsPath);
  if (articleList.ids && articleList.ids.length > 0) {
    var result =  articleList.ids.forEach(function(pmid, idx){
      promises.push(_requests.sendRequestAndProcessArticle(pmid, idx));
    });

    Promise.all(promises).catch(function(e) {
      console.log(e);
    }).then(processedArticles => {
      processedArticles = duplicateCheck(processedArticles);
      convertToCsv(processedArticles);
    });
  }
}

var duplicateCheck = (articles) => {
  console.log('... checking for duplicates');

  var articlesByPmid = {};
  var piiToPmid = {};
  var titleToPmid = {};
  articles.forEach(function(article){
    articlesByPmid[article.pmid] = article;
    article.duplicate_pii = '';
    article.duplicate_title = '';
    if (!piiToPmid[article.pii]) {
      piiToPmid[article.pii] = article.pmid;
    } else {
      article.duplicate_pii = piiToPmid[article.pii];
    }

    if (!piiToPmid[article.title]) {
      piiToPmid[article.title] = article.pmid;
    } else {
      article.duplicate_title= piiToPmid[article.title];
    }

  });

  return articles;
}

var convertToCsv = (articles) => {
  console.log('... creating CSV');
  var timestamp = Math.round(new Date().getTime()/1000);
  var filePath = './data/' + config.journal.name.toLowerCase() + '-' + timestamp + '.csv';
  var csv = '';
  csv += 'PMID, PII, DOI, Pub Status, EPub Date, Issue Pub Date, Duplicated PII, Duplicated Title, Title\r\n';
  articles.forEach(function(article){
    csv += '"' + article.pmid + '","' + article.pii + '","' + article.doi + '","' + article.pub_status + '","' + article.e_pub_date + '","' + article.issue_pub_date + '","' + article.duplicate_pii + '","' + article.duplicate_title + '","' + article.title + '"\r\n';
  });

  fs.writeFile(filePath, csv, function(err) {
    if(err) {
      return console.log(err);
    } else {
      console.log('... saved CSV in: ' + filePath);
    }
  });
}

if (config.journal && config.journal.name && config.journal.issn) {
  console.log('----- Starting Duplicate Publication Check -----');

  articleIdsPath = config.data_path + config.journal.name.toLowerCase() + '.js';

  if (fs.existsSync(articleIdsPath)) {
    getArticleMetadata(articleIdsPath);
  } else {
    _createArticlesList.createFile().catch(function(e) {
      console.log(e);
    }).then(() => {
      getArticleMetadata(articleIdsPath);
    });
  }
} else {
  console.log('Add journal name and ISSN to config.js');
}
