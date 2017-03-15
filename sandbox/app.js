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
  hsFile: {
    type: String
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
        
        var title      = "HsTitleHere";
        var image_origial = "hsInput.png";
        fs.readFile(image_origial, function(err, original_data){
        	var base64File = original_data.toString('base64');
		var newHs = new Hs({
          		title : title,
          		hsFile: base64File
       		 });


        	newHs.save(function(err, hs){
          		if(err){
            			console.log(err);
            			throw err;
         		}
          		else{
            			res.send('hs object stored');
        	  	}

       		});

        });
        
});

app.get('/download', function(req, res){
  console.log('hs inside /download');

   Hs.findOne(function(err, hs){
      console.log('found: \n');
      console.log(hs);

      var decodedImage = new Buffer(hs.hsFile, 'base64');
      fs.writeFile('recImage.png', decodedImage, function(err) {});

      /*var filename = 'recImage.png';
      var mimetype = mime.lookup('transfers/hsInput.png');
      console.log('filename: ' + filename + '\nmimetype: '+ mimetype);
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(decodedImage);
      filestream.pipe(res);*/
      res.end(decodedImage);
    });
});

module.exports = app;

