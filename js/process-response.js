var processDate = (dateObj) => {
  var dateStr = '';

  dateStr += dateObj.Month ? dateObj.Month : 'N/A';
  dateStr += '/';
  dateStr += dateObj.Day ? dateObj.Day : 'N/A';
  dateStr += '/';
  dateStr += dateObj.Year ? dateObj.Year : 'N/A';

  return dateStr;
}

var article = (pmid, pubMedJson) => {
  console.log('... procesing PMID ',pmid);
  var articleJson = JSON.parse(pubMedJson)
  if (!articleJson.PubmedArticleSet)
    console.log(articleJson);
  else
  articleJson = articleJson.PubmedArticleSet.PubmedArticle;
  var pii = 'N/A';
  var doi = 'N/A';
  var pubStatus = 'N/A';
  var ePubDate = 'N/A';
  var issuePubDate = 'N/A';

  // Title
  var articleTitle = (articleJson.MedlineCitation && articleJson.MedlineCitation.Article && articleJson.MedlineCitation.Article.ArticleTitle) ? articleJson.MedlineCitation.Article.ArticleTitle : 'N/A';

  // IDs
  if (articleJson.PubmedData && articleJson.PubmedData.ArticleIdList && articleJson.PubmedData.ArticleIdList.ArticleId) {
    articleJson.PubmedData.ArticleIdList.ArticleId.forEach(function(idData){
      if (idData && idData.IdType && idData.IdType === 'pii') {
        pii = idData._t;
      } else if (idData && idData.IdType && idData.IdType === 'doi') {
        doi = idData._t;
      }
    });
  }

  // EPub Date
  if (articleJson.MedlineCitation && articleJson.MedlineCitation.Article && articleJson.MedlineCitation.Article.ArticleDate) {
    if (articleJson.MedlineCitation.Article.ArticleDate.DateType === 'Electronic') {
      ePubDate = processDate(articleJson.MedlineCitation.Article.ArticleDate);
    }
  }

  // Pub Date
  if (articleJson.MedlineCitation && articleJson.MedlineCitation.Article && articleJson.MedlineCitation.Article.Journal && articleJson.MedlineCitation.Article.Journal && articleJson.MedlineCitation.Article.Journal.JournalIssue && articleJson.MedlineCitation.Article.Journal.JournalIssue.PubDate) {
    issuePubDate = processDate(articleJson.MedlineCitation.Article.Journal.JournalIssue.PubDate);
  }

  // Pub Status
  if (articleJson.PubmedData && articleJson.PubmedData.PublicationStatus) {
    pubStatus = articleJson.PubmedData.PublicationStatus;
  }

  // Result Data
  var articleData = {
    pmid: pmid,
    pii: pii,
    doi: doi,
    title: articleTitle,
    pub_status: pubStatus,
    e_pub_date: ePubDate,
    issue_pub_date: issuePubDate
  };

  return articleData;
}

var processResponse = {
  article
}

module.exports = processResponse;
