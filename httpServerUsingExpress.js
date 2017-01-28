//nodejs call to import express module
var express = require('express');

//all express commands are app.
var app = express();

app.get('/', function(req,res){
	res.send('hellow word/n');
console.log('received get request');
})

app.put('/', function(req,res){
	res.send('got your put/n');
console.log('recieved put request')
})

app.listen(3010, function() {
	console.log('were listening on port 8787')
})

