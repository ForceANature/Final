var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ForceANature:Karandash1115@cluster0.9skx1.mongodb.net/MyProjectDB');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {
  console.log("connection succeeded");
})

var app = express()


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/sign_up', function(req, res) {
  var name = req.body.name;
  var surname = req.body.surname;
  var email = req.body.email;
  var pass = req.body.password;
  var country = req.body.country;
  var city = req.body.city;
  var today = new Date();

  var data = {
    "name": name,
    "surname": surname,
    "email": email,
    "password": pass,
    "start-time": today,
    "country": country,
    "city": city
  }
  db.collection('Users').insertOne(data, function(err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");

  });

  return res.redirect('index.html');
})

app.post('/sign_in', async(req, res) =>{
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await db.collection('Users').findOne({email: email});

    if(useremail.password == password){
      db.collection('Me').remove({});
      db.collection('Me').insertOne(useremail, function(err, collection) {
        if (err) throw err;
        console.log("Record(Me) inserted Successfully");

      });
      res.redirect('index.html');
    }else{
      res.send("invalid password input");
    }
  } catch (e) {
    res.send("invalid login/password input");
  }
})



app.get('/', function(req, res) {
  res.set({
    'Access-contrqol-Allow-Origin': '*'
  });
  return res.redirect('index.html');
}).listen(1234)


console.log("server listening at port 1234 - http://127.0.0.1:1234/");
