var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var hbs = require('hbs');
// var logger =require('morgan');
var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var dotenv  = require('dotenv');
// var passport = require('passport');





var app = express();
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', express.static(__dirname + '/'));



app.get('/',function(req,res){
  res.sendfile('./client/index.htm');
});

app.use((req, res, next) => {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
 });
app.use((err, req, res, next) => {
   res.status(err.status || 500);
   res.json({ error: err })
   });

app.listen(8080, function(){
   console.log("Listening on port 8080...");
});
  console.log('Server running at http://127.0.0.1:8080/');