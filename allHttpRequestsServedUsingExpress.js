//nodejs call to import express module
var express = require('express');
var bodyParser = require('body-parser')

//all express commands are app.
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())




/*******************ROUTERS*************************/

/*
app.get('/', function(req,res){
	res.send('hellow word/n');
console.log('received get request');
})

app.put('/', function(req,res){
	res.send('got your put/n');
console.log('recieved put request')
})



var cb0 = function (req, res, next) {
  console.log('CB0')
//  res.send('Hello from A!')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
//  res.send('Hello from B!')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

//app.get('/me',[cb0,cb1,cb2])

//app.get('/me',function(req,res){
//	res.download('httpServerUsingExpress.js');
//})

//app.get('/me',function(req,res){
//      res.end()
//})

*/

/*app.get('/me', function (req, res, next) {

  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = 'Any file placed in /public directory';//req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});

app.get('/me',function(req,res){
    //  res.redirect(303,'http://example.com');
//	res.redirect('/');
//        res.redirect('/public');
        res.redirect('/public/kos.txt');
})

*/


//app.use(function(req,res){
//res.send("hel");
//})




app.get('/', function(req,res){
console.log(req.body);
res.send(req.body);
})

app.post('/', function(req,res){
console.log(req.body);
res.send(req.body);
})


app.listen(3011, function() {
	console.log('were listening on port 3011')
})

