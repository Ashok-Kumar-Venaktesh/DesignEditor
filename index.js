var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var insert_data = require('./db_operations.js')
var db = require('./db_operations.js')

var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb', extended: true})); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyParser.json({limit:1024102420, type:'application/json'}));
// parse various different custom JSON types as JSON
//app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
//
// // parse an HTML body into a string
// app.use(bodyParser.text({ type: 'text/html' }))

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/app'));

// views is directory for all template files
//app.set('views', __dirname + '/views');

//app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.send('home page is loading')
});

app.get('/cool', function(request, response) {
  response.send('cool page is loading');
});

app.get('/get_all_rows', function(req, res){
  db.get_all_rows(db.conn(), res)
})

app.get('/get_canvas_data/:project_name', function(req, res){
  project_name = req.params.project_name
  db.get_canvas_data(db.conn(), project_name, res)
})

app.get('/delete/:project_name', function(req, res){
  project_name = req.params.project_name
  console.log("project_name --> ",project_name);
  db.delete_data(db.conn(), project_name, res)
})

app.post('/update', function(req, res){
  console.log("data to be updated is ", req.body);
  project_name = req.body.project_name
  canvas_data = req.body.canvas_data
  db.update_data(db.conn(), project_name, canvas_data, res)
})

app.post('/insert', function(req, res){
  console.log(req.body);
  project_name = req.body.project_name
  canvas_data = req.body.canvas_data
  db.insert_data(db.conn(), project_name, canvas_data, res)
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
