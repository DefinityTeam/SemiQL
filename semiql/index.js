let express = require('express');
let app = express();
let mysql = require('mysql');

exports.createSemiQLAPI = function (config, requests) {
    let connection;

    if (config.db.type == 'mysql') {
        connection = mysql.createConnection({
            host: config.db.host,
            user: config.db.username,
            password: config.db.password !== false ? config.db.password : '',
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
                                endpoint[1].values.forEach(x => values += `${x},`);
                                values = values.slice(0, -1);
                            }

                            connection.query(`SELECT ${values} FROM ${endpoint[1].from} ${endpoint[1].match ? `WHERE ${endpoint[1].match} = '${req.url.split('/')[3]}'` : ``}`, (error, results) => {

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

    app.listen(5000)
    console.log('online');

}