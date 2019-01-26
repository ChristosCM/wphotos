var express = require('express');
var bodyParser = require ('body-parser');
var fs = require('fs');
var multer = require("multer");
var app = express();

//declaration of PORT, important for cloud hosting on AWS (amazon web services)
var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 var Storage = multer.diskStorage({

    destination: function(req, file, callback) {

        callback(null, "./Images");
    },

    filename: function(req, file, callback) {

        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }

});
var upload = multer({

    storage: Storage

}).array("imgUploader", 3); //Field name and max count
 

app.get('/people', function (req, res) {
    fs.readFile( __dirname + "/" + "people.json", 'utf8', function (err, data) {
    //    console.log( data );
       res.type('json');
       res.end( data );
    });
 })
app.get('/people/:username', function (req,res) {
    fs.readFile(__dirname + "/" + "people.json", 'utf-8',function (err,data){
        var people = JSON.parse(data);
        for (var i=0; i<people.length; i++){
            if (people[i].username == req.params.username){
                var person = people[i]
            }
        }
        res.type('json');
        res.end(JSON.stringify(person));

    });
})

 app.post('/people', function (req, res) {
    fs.readFile( __dirname + "/" + "people.json", 'utf8', function (err, data) {
        var people = JSON.parse(data)
        if (req.get('access_token') != "concertina"){
            res.status(403).send();
        }
        exists = false;
        for (var i=0; i<people.length; i++){
            if (people[i].username == req.get('username')){
                exists = true;
            }
        }
        if (exists == true){
            res.status(400).send();
        } else {
            var user =  {
            "forename" : req.get('forename'),
            "surname" : req.get('surname'),
            "username" : req.get('username'),
            "password" : req.get('password'),
         }
         data = JSON.parse(data);
         data = data + user;
         res.end( JSON.stringify(data));
        }
    });
 });
 app.post("/api/Upload", function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });

});
app.set('view engine', 'html');
var options = {
    extensions:['css','js','jpeg','jpg','png','json','html']

};
app.use(express.static('./', options));
app.get('/' , function(req,res){
    return res.sendFile(__dirname + '/index.html');
});

app.listen(port);
console.log("The app is listening now on localhost:8080")
module.exports = app;



