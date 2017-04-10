var config = {
  journal: {
    name: '',
    issn: ''
  },
  pubmed: {
    fetch_url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&id=',
    search_url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed'
  }
};

module.exports = config;
