# PubMed Duplicate Publication Report
Find duplicate publications indexed at [PubMed](https://www.ncbi.nlm.nih.gov/pubmed) by PII or Title per journal. Article metadata at PubMed is queried by PMIDs in `./data/${journal-name}.js`. Article PMID, PII, DOI, Pub Status, EPub Date, Issue Pub Date, Duplicate PII (PMID for duplicate listed), Duplicate Title (PMID for duplicate listed) and Title are saved in a CSV in `./data/${journal-name}-${timestamp}.csv`

## Getting Started

```bash
$ git clone _
$ cd __
$ npm install
```

Use `config.js.ex` to create `config.js`. Journal name and ISSN are required in `config.js`. On startup, a list of PMID will be created in `./data/${journal-name}.js`, if not already created.

## Run
```bash
$ npm start
```
