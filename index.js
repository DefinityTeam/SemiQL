const YAML = require('yaml');
const fs = require('fs');
const semiql = require('./semiql');

let config = YAML.parse(fs.readFileSync('config.yml', 'utf8'));
let requests = YAML.parse(fs.readFileSync('requests.yml', 'utf8'));

semiql.createSemiQLAPI(config, requests);