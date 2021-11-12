import YAML from 'yaml';
import fs from 'fs';
import express from 'express';
import mysql from 'mysql';

let config = YAML.parse(fs.readFileSync('config.yml', 'utf8'));
let requests = YAML.parse(fs.readFileSync('requests.yml', 'utf8'));
const app = express();

interface DBConfig {
    host: string,
    username: string,
    password: string | false,
    database: string,
    type: string
}
interface APIConfig {
    db: DBConfig,
    dashboard: boolean
}
type Requests = Record<string, Record<string, {
    request: string; 
    type: string;
    from: string;
    values: Array<string> | string;
    match: string;
}>>

let createSemiQLAPI = function (config: APIConfig, requests: Requests): void {
    let connection: mysql.Connection;
    let pass = config.db.password !== false ? config.db.password : '';

    if (config.db.type == 'mysql') {
        connection = mysql.createConnection({
            host: config.db.host,
            user: config.db.username,
            password: pass,
            database: config.db.database
        });

        //console.log(Object.entries(requests));

        Object.entries(requests).forEach(sub => {
            Object.entries(sub[1]).forEach(endpoint => {
                switch(endpoint[1].request) {
                    case 'get':
                        app.get(`/${sub[0]}/${endpoint[0]}${endpoint[1].match ? '/*' : ''}`, (req, res) => {

                            //req.url.split('/');
                            
                            let values = '';
                            if (endpoint[1].values == 'everything') {
                                values = '*'
                            } else if (endpoint[1].values[0]) {
                                (<string[]>endpoint[1].values).forEach(x => values += `${x},`);
                                values = values.slice(0, -1);
                            }

                            connection.query(`SELECT ${values} FROM ${endpoint[1].from} ${endpoint[1].match ? `WHERE ${endpoint[1].match} = '${req.url.split('/')[3]}'` : ``}`, (error: string, results: Array<Object>) => {

                                if (error) return res.send(JSON.stringify({error: error}));
                                //console.log(`SELECT ${values} FROM ${endpoint[1].from} ${endpoint[1].match ? `WHERE ${endpoint[1].match} = '${req.url.split('/')[3]}'` : ``}`);
                                //res.send('<br>hi');
                                //console.log(results);

                                if (results.length == 1) {
                                    res.send(results[0]);
                                } else {
                                    res.send(results);
                                }
                                
                            });
                        });

                    break;
                }
            });

        });
    }

    app.listen(5000, () => { console.log('[SEMIQL]: API online') })

}

createSemiQLAPI(config, requests);