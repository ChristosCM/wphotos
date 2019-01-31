var express = require('express');
var bodyParser = require ('body-parser');
var fs = require('fs');
var multer = require("multer");
var app = express();

//declaration of PORT, important for cloud hosting on AWS (amazon web services)
//var port = process.env.PORT || 8080;
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
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
       res.type('json');
       res.status(200).end( data );
    });
 })
app.get('/people/:username', function (req,res) {
    fs.readFile(__dirname + "/" + "people.json", 'utf-8',function (err,data){
        console.log(req.params.username);
        var people = JSON.parse(data);
        var found = false;
        for (var i=0; i<people.length; i++){
            if (people[i].username == req.params.username){
                var person = people[i]
                found = true;
                
                
            }
        }
        if (found==true){
            res.type('json');
                res.status(200).end(JSON.stringify(person));
        }else{
        res.type('json');
        res.status(204).end(JSON.stringify("No one found"));
        }
        

    });
})
app.get('/images', function(req,res){
    var categories = req.query.cat

    var sendIm = [];
    fs.readFile("./Images/images.json" ,function(err,data){
        var images = JSON.parse(data);
        for (i=images.length-1; i>0; i--){
            for (y=0; y<categories.length; y++){
                if (images[i].category == categories[y]){
                    sendIm.push(images[i]);
                }
            }
        }
        res.status(200).send(JSON.stringify(sendIm))
        
    });
    
     
});
//function to check if user exists. Not used as it needs to be implemented with a callback to to a-sync req.
function exists(user){
    fs.readFile( __dirname + "/" + "people.json", 'utf8', function (err, data) {
        var people = JSON.parse(data)
        ex = false;
        for (var i=0; i<people.length; i++){
            if (people[i].username == user){
                ex = true;
            }
        }
    return ex;
    });
}

 app.post('/people', function (req, res) {
    fs.readFile( __dirname + "/" + "people.json", function (err, data) {
        var people = JSON.parse(data)
        if (req.body.access_token != "concertina"){
            res.status(403).send();
        }
        exists = false;
        for (var i=0; i<people.length; i++){
            if (people[i].username == req.body.username){
                exists = true;
            }
        }
        if (exists == true){
            res.status(400).send();
        } else {
            var user =  {
            "forename" : req.body.forename,
            "surname" : req.body.surname,
            "username" : req.body.username,
            "email" : req.body.email
         }
         fs.readFile("people.json" ,function(err,data){
            if (err){console.log(err)}
            var people = JSON.parse(data);
            people.push(user);
            fs.writeFile("people.json" , JSON.stringify(people), function (err){
                if (err){console.log(err)};
            });
        });
         res.end( JSON.stringify(data));
        }
    });
 });
//function that uploads images and stores their place and category in a json file
 app.post("/api/Upload", function(req, res) { 
    upload(req, res, function(err) {  
        ex = false;

        fs.readFile( __dirname + "/" + "people.json", 'utf8', function (err, data) {
            var people = JSON.parse(data)
            for (var i=0; i<people.length; i++){
                if (people[i].username == req.body.user){
                    ex = true;
                }
            }
        var newim = [];
        if (ex){
        for (i=0; i<req.files.length; i++){
            if (req.files[i].mimetype != "image/jpeg" && req.files[i].mimetype != "image/png" ){
                fs.unlink(req.files[i].path, (err) => {
                    if (err) throw err;
                    console.log(req.files[i].path+' was deleted, Wrong Type');
                  });
                  //wrong status in order to print right statement
                return res.status(200).end("Incorect file type for: "+req.files[i].originalname+" Only JPEG or PNG files are accepted");
            }
            var newImage = {
                "path" : req.files[i].path,
                "category": req.body.category,
                "date": new Date(),
                "user": req.body.user
            };
            newim.push(newImage);
        }
            fs.readFile("./Images/images.json" ,function(err,data){
                if (err){console.log(err)}
                var images = JSON.parse(data);
                for (i=0; i<newim.length; i++){
                    images.push(newim[i]);
                }
                fs.writeFile("./Images/images.json" , JSON.stringify(images), function (err){
                    if (err){console.log(err)};
                });
            });
        if (err instanceof multer.MulterError) {
        } else if (err){
            return res.status(400).end("Something went wrong!");
        }
        res.type('text');
        
        return res.status(201).end("Files uploaded sucessfully!");
    }else{
        for (i=0; i<req.files.length; i++){
        fs.unlink(req.files[i].path, (err) => {
            if (err) throw err;
            //console.log(req.files[i].path+' was deleted, Incorrect User');
          });
        }
        return res.end("User: "+req.body.user+" was not found. File not uploaded. If you want to upload, please signup.");
    }
    });
});
});
app.set('view engine', 'html');
var options = {
    extensions:['css','js','jpeg','jpg','png','json','html']

};
app.use(express.static('./', options));
app.get('/' , function(req,res){
    return res.status(200).sendFile(__dirname + '/index.html');
});
 // Handle 404
 app.use(function(req, res) {
    res.status(404).send("404: Page not found");
 });
 
 // Handle 500
 app.use(function(error, req, res, next) {
    res.status(500).send('500: Internal Server Error');
 });
app.listen(server_port, server_ip_address);
console.log("The app is listening now on localhost:8080")
module.exports = app;

//possible categories:
//technology, landscape, portrait, night photography