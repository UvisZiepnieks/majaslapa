var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var json = require('json');
const express = require('express');
const path = require('path');
const { JSDOM } = require("jsdom");
const myJSDom = new JSDOM ("./index.html");
const $ = require('jquery')(myJSDom.window);


var results;
var vards;
var uzvards;
var epasts;
var parole;
var insert1;
var insert2;
var insert3;
var table;
const bodyParser = require('body-parser');
const app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users"
});

con.connect(function(err) {
  if (err) throw err;
});

app.use(bodyParser.urlencoded({ extended: true })); 

const port = 8080;

app.listen(port, () => {
  console.log(`Server running on port${port}`);
});


app.all('/', function(req, res) {
  var data = [];
  var users = [];
  var emails = [];
  con.query("SELECT * FROM user", function (err, result, fields) {
    if (err) throw err;
      console.log(result);
      table="";
      console.log(result);
      res.render(path.join(__dirname, './index.html'),{ title: 'User List', userData: result });
  });
});


app.post('/insert', (req, res) => {
  res.send(`inserted data is:${req.body.user} ${req.body.pass} ${req.body.email}.`);
    insert1 = req.body.user;
    insert2 = req.body.pass;
    insert3 = req.body.email;
    callInsert();
});


function getData(){
con.query("SELECT * FROM user", function (err, result, fields) {
  if (err) throw err;
  let results = '<table>';
  console.log(result);
  result.forEach(res => {
    console.log("Results: "+result);
    result.forEach(res => {
      results += '<tr><td>'+res.id+'</td><td>'+res.username+'</td><td>'+res.email+'</td></tr>';
    });
    results += '</table>';
  });
});

}


function writeData(vards, parole, epasts){
  con.query("INSERT into user (username, password, email) VALUES ('"+vards+"', '"+parole+"', '"+epasts+"')", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    //process.exit(0); 

  });
  }

  function callInsert(){
    writeData(insert1, insert2, insert3);
  }
  function callSelect(){
    getData();
  }





