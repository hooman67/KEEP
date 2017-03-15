var fs = require('fs');
var express = require('express');
var path = require('path');
var mime = require('mime');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('express-flash');
var handlebars = require('express-handlebars');

//MONGO STUFF
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://35.163.48.45/sandbox');
mongoose.Promise = global.Promise
async = require('async'); 



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('handlebars', handlebars()); app.set('view engine', 'handlebars');

//MULTAR
var multer = require('multer');
var upload = multer({ dest: 'transfers/' });





/**********************************************************************
****************************MOGO FILE UPLOAD STUFF*********************
***********************************************************************/
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;


var transfers_base = path.join(__dirname, "transfers");
var transfers = path.join(transfers_base, "u");

/**********************************************************************
**********************END OF MOGO FILE UPLOAD STUFF********************
***********************************************************************/







app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 180000 }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//flash stuff
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});










//hs schema
var HsSchema = mongoose.Schema({
  title: {
    type: String
  },
  file: {
  }
});


HsSchema.plugin(filePlugin, {
    upload_to: make_upload_to_model(transfers, 'photos'),
    relative_to: transfers_base
});
var Hs = db.model("Hs", HsSchema);
//var Job = module.exports = mongoose.model('Job', jobSchema);


// Route that incorporates flash messages from either req.flash(type) or res.locals.flash
app.get('/', function( req, res ) {
    res.render('index');
});
app.post('/', upload.single('description_file'), function( req, res ) {
        
        console.log('Uploaded File:\n');
        console.log(req.file);
        console.log('\n\n\n');

        var title      = "HsTitleHere";
        var file   = req.file;

        var newHs = new Hs({
          title : title,
          file: file
        });

      
        newHs.save(function(err, hs){
          if(err){
            console.log(err);
            throw err;
          } 
          else{
            console.log('\n\n\ncreated hs:\n'+hs+'\n\n');
          }

        });

        res.send('REceived POST');
});



app.get('/kos', function (req, res, next) {

  var options = {
    root: __dirname + '/transfers/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = '105bd3442f10c4d3b28c582397d659cd';
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



//METHOD TO SET FILE NAME
//Another method for sending jobs not useing express:This method sets the file name
app.get('/download', function(req, res){

  var file = 'transfers/105bd3442f10c4d3b28c582397d659cd';

  var filename = 'hsDownloaded.png';
  var mimetype = mime.lookup(file);
  console.log('filename: ' + filename + '\nmimetype: '+ mimetype)
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});



/*
//The following example illustrates using res.sendFile to provide fine-grained support for serving files:

app.get('/user/:uid/photos/:file', function(req, res){
  var uid = req.params.uid
    , file = req.params.file;

  req.user.mayViewFilesFrom(uid, function(yes){
    if (yes) {
      res.sendFile('/uploads/' + uid + '/' + file);
    } else {
      res.status(403).send("Sorry! You can't see that.");
    }
  });
});
*/



module.exports = app;

