var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var json = require('json');
const express = require('express');
const path = require('path');
const { JSDOM } = require("jsdom");
const myJSDom = new JSDOM("./index.html");
const $ = require('jquery')(myJSDom.window);

var results;
var vards;
var uzvards;
var epasts;
var parole;
var id;
var insert1;
var insert2;
var insert3;
var insert4;
var table;

const bodyParser = require('body-parser');
const app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
const port = 8080;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "website"
});

con.connect(function (err) {
  if (err) throw err;
});

app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`Server running on port${port}`);
});

// produktu lapa
app.all('/', function (req, res) {

  con.query("SELECT * FROM produkti", function (err, result, fields) {
    if (err) throw err;
    res.render(path.join(__dirname, './produkti.html'), { data: { userData: result, lietotajs: null } });
  });
});

app.all('/guitar', function (req, res) {

  con.query("SELECT * FROM produkti WHERE tag = 'guitar'", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.render(path.join(__dirname, './produkti.html'), { title: 'User List', userData: result });
  });
});

app.all('/drums', function (req, res) {

  con.query("SELECT * FROM produkti WHERE tag = 'drums'", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './produkti.html'), { title: 'User List', userData: result });
  });
});
app.all('/produkt', function (req, res) {

  con.query("SELECT * FROM produkti WHERE id = " + req.body.prod_id, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './produkta_lapa.html'), { title: 'User List', userData: result });
  });
});
app.all('/buy', function (req, res) {

  con.query("SELECT * FROM produkti WHERE id = " + req.body.prod_id, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './pirkt.html'), { title: 'User List', userData: result });
  });
});
app.all('/confirm', function (req, res) {
  insert1 = "'" + req.body.epasts + "'";
  con.query("SELECT * FROM users WHERE epasts = " + insert1, function (err, result, fields) {
    console.log('epasts izvele ' + result);
    if (err) throw err;
    if (result.length == 0) {
      con.query("SELECT * FROM produkti WHERE id = " + req.body.prod_id, function (err, result, fields) {
        if (err) throw err;
        table = "";
        console.log(result);
        res.render(path.join(__dirname, './produkta_lapa.html'), { title: 'User List', userData: result });
      });
    } else {
      result.forEach(element => {
        con.query("INSERT into pasutijums (produkta_id, pasutitaja_id, izsutits) VALUES ('" + req.body.prod_id + "', '" + element.id + "', '" + 0 + "')", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
        });
      });

      res.render(path.join(__dirname, './confirm.html'), { title: 'User List', userData: result });
    }
  });
});

app.all('/completeAdd', function (req, res) {
  console.log(req.body.file);
  const type = req.body.file.split('.').pop();
  const base64String = toBase64(req.body.file);
  con.query("INSERT into produkti (produkta_nr, nosaukums, cena, tag, attels) VALUES ('" + req.body.ProduktaNr + "', '" + req.body.nosaukums + "', '" + req.body.cena + "', '" + req.body.tag + "','"
    + "data:image/" + type + ";base64," + base64String + "')", function (err, result, fields) {
      if (err) throw err;
    });


  con.query("SELECT * FROM produkti ", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './produkti.html'), { title: 'User List', userData: result });
  });
});


function toBase64(filePath) {
  const img = fs.readFileSync(filePath);

  return Buffer.from(img).toString('base64');
}



app.all('/addInstrument', function (req, res) {

  con.query("SELECT * FROM produkti ", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './add_instrument.html'), { title: 'User List', userData: result });
  });
});

//lietotaju lapa

app.all('/login', function (req, res) {
  result = null;
  res.render(path.join(__dirname, './login.html'), { title: 'User List', userData: result });
});

app.all('/register', function (req, res) {
  res.render(path.join(__dirname, './register.html'), { title: 'User List', userData: result });
});


app.all('/users', function (req, res) {

  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './index.html'), { title: 'User List', userData: result });
  });
});

app.all('/index', function (req, res) {

  insert1 = "'" + req.body.epasts + "'";
  insert2 = "'" + req.body.pass + "'";
  con.query("SELECT * FROM users where epasts= " + insert1 + " and parole= " + insert2, function (err, re, fields) {
    if (err) throw err;
    re.forEach(resul => {
      if (resul.loma < 2) {
        con.query("SELECT * FROM produkti", function (err, result, fields) {
          if (err) throw err;
          res.render(path.join(__dirname, './produkti.html'), { data: { userData: result, lietotajs: re } });
        });
      } else if (resul.loma == 2) {
        con.query("SELECT * FROM produkti", function (err, result, fields) {
          if (err) throw err;
          res.render(path.join(__dirname, './produkti.html'), { data: { userData: result, lietotajs: re } });
        });
      }
      else {
        con.query("SELECT * FROM users", function (err, result, fields) {
          if (err) throw err;
          res.render(path.join(__dirname, './index.html'), { data: { userData: result, lietotajs: re } });
        });
      }
    });

  });
});

app.post('/insert', (req, res) => {
  res.send(`Ievietotie dati ir: ${req.body.vards} ${req.body.uzvards} ${req.body.epasts} ${req.body.parole}.`);
  insert1 = req.body.vards;
  insert2 = req.body.uzvards;
  insert3 = req.body.epasts;
  insert4 = req.body.parole;
  insert5 = req.body.loma;
  callInsert();
});

app.all('/edit', function (req, res) {

  console.log("id " + req.body.id);
  con.query("SELECT * FROM users WHERE id=" + req.body.id, function (err, result, fields) {
    if (err) throw err;
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './edit.html'), { title: 'User List', userData: result });
  });
});

app.all('/update', (req, res) => {
  res.send(`Izmainītie dati ir :${req.body.vards} ${req.body.uzvards} ${req.body.epasts} ${req.body.parole}.`);
  id = req.body.id;
  insert1 = req.body.vards;
  insert2 = req.body.uzvards;
  insert3 = req.body.epasts;
  insert4 = req.body.parole;
  console.log("insert1: " + insert1);
  updateData(id, insert1, insert2, insert3, insert4);
});


app.all('/delete', (req, res) => {
  res.send(`Dzēstie dati ir :${req.body.idd}.`);
  id = req.body.idd;
  deleteData(id);
});


function getData() {
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

function writeData(vards, uzvards, epasts, parole, loma) {
  con.connect(function (err) {
    con.query("INSERT into users (vards, uzvards, epasts, parole, loma) VALUES ('" + vards + "', '" + uzvards + "', '" + epasts + "', '" + parole + "'," + loma + ")", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

function updateData(id, vards, uzvards, epasts, parole) {
  con.connect(function (err) {
    con.query('UPDATE users SET vards="' + vards + '", uzvards="' + uzvards + '" , epasts="' + epasts + '", parole="' + parole + '" where id = ' + id, function (err, result, fields) {
      if (err) throw err;
      console.log(result.affectedRows + " Izmainitas rindas");
    });
  });
}
function deleteData(id) {
  con.connect(function (err) {
    con.query("Delete from users where id = " + id, function (err, result, fields) {
      if (err) throw err;
      console.log(result.affectedRows + " Izmainitas rindas");
    });
  });
}

function showData() {
  app.all('/', function (req, res) {

    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      table = "";
      console.log(result);
      res.render(path.join(__dirname, './index.html'), { title: 'User List', userData: result });
    });
  });
}


function callInsert() {
  writeData(insert1, insert2, insert3, insert4, insert5);
}
function callSelect() {
  getData();
}



