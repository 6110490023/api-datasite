const PORT = 3000
var jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')
const mssql = require('mssql')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const bcrypt = require('bcrypt')
const saltRounds = 10
const secret = "app-BMI-2022"

const app = express()
const config = {
  user: 'integreatadba',
  password: 'zJws5b4#QgvF374eo5',
  database: 'integreata',
  server: 'thailandbimuser.com',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}


app.use(cors())

app.get('/test', async function (req, res, next) {
    mssql.connect(config, function(err){
        if(err){
            console.log(err.message); 
            return;
         }
         console.log('connection complete');
         let request = new mssql.Request();
         let query ='select * from Members';
         request.query(query, function (err, result){
            if(err){
                console.log(err.message); 
                return;
             }
             else{
                console.log(result['recordset']);
                res.json(result['recordset']);
             }
         });
    });
})

app.get('/material-category-all', async function (req, res, next) {
    mssql.connect(config, function(err){
        if(err){
            console.log(err.message); 
            return;
         }
         console.log('connection complete');
         let request = new mssql.Request();
         let query ='select * from Material_Category';
         request.query(query, function (err, result){
            if(err){
                console.log(err.message); 
                return;
             }
             else{
                
                let materialCategory = result['recordsets'][0].map((value,index)=>{
                    return {'IntCatId':value['IntCatId'], 'CategoryName':value['CategoryName']}

                });
                res.json(materialCategory);
             }
         });
    });
})
app.post('/login', async function (req, res, next) {
    mssql.connect(config, function(err){
        if(err){
            console.log(err.message); 
            return;
         }
         console.log('connection complete');
         let request = new mssql.Request();
         let query ='select * from Members';
         request.query(query, function (err, result){
            if(err){
                console.log(err.message); 
                return;
             }
             else{
                
                let materialCategory = result['recordsets'][0].map((value,index)=>{
                    return {'IntCatId':value['IntCatId'], 'CategoryName':value['CategoryName']}

                });
                res.json(materialCategory);
             }
         });
    });
});


app.listen(PORT, function () {
    console.log('CORS-enabled web server listening on port' + PORT)
})