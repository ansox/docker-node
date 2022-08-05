const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

var configAxios = {
  method: 'get',
  url: 'https://randommer.io/api/Name?nameType=fullname&quantity=1',
  headers: { 
    'x-api-key': 'd8fbf113e8774760b9f51527a453c1b4'
  }
};

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

let connection;
const mysql = require('mysql');

function insertName(name) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO people(name) values("${name}");`;
   
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  })
}

function selectAllNames() {
  return new Promise((resolve, reject) => {
    const sql = `select name from people;`;
   
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  })
}

app.get('/', (req, res) => {
  connection = mysql.createConnection(config);

  let actualName = '';

  axios(configAxios)
    .then(function (response) {
      const name = response.data;
      actualName = name;
      return insertName(name);
    })
    .then(() => {
      return selectAllNames();
    })
    .then((result) => {
      connection.end();
      res.send(`
        <h1>Full Cycle Rocks!!!</h1>
        <p>New name: ${actualName}</p>
        <ul>
        ${
          result.map(item => {
            return `<li>${item.name}</li>`
          }).join('')
        }
        </ul>
      `)
    })
    .catch(function (error) {
      console.log(error);
    });  
});

app.listen(port, () => {
  console.log('Rodando na porta ', port);
})