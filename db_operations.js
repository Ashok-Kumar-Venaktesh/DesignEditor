var mysql = require('mysql');

var DB_NAME    = 'ProjectDetails',
    HOST       = 'localhost',
    USER       = 'root',
    PASSWORD   = '',
    TABLE_NAME = 'projects'


var conn = function(){
  return mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB_NAME
  })
}


var create_db = function(){
  var conn = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD
  });

  conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    conn.query("CREATE DATABASE " + DB_NAME, function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });
}


var create_table = function(conn){
  console.log('create table called');
  conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE " + TABLE_NAME + " (ProjectName VARCHAR(255), CanvasData LONGTEXT, PRIMARY KEY(ProjectName))";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });
}


var insert_data = function(conn, project_name, canvas_data, res){
  console.log("inserting data");
  conn.connect(function(err) {
  if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO " +  TABLE_NAME + " (ProjectName, CanvasData) VALUES ('"+ project_name + "','" + canvas_data + "')";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      console.log("insertion successful");
      res.send('success')
    });
  });
}


var update_data = function(conn, project_name, canvas_data, res){
  console.log("updating data");
  conn.connect(function(err) {
  if (err) throw err;
    console.log("Connected!");
    var sql = "UPDATE " + TABLE_NAME+ " SET CanvasData = '" + canvas_data + "' WHERE ProjectName='" + project_name + "'";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      res.send('success')
      console.log("updation successfull");
    });
  });
}


var delete_data = function(conn, project_name, res){
  console.log("deleting data");
  conn.connect(function(err) {
  if (err) throw err;
    console.log("Connected!");
    // "DELETE FROM customers WHERE address = 'Mountain 21'"
    var sql = "DELETE FROM " + TABLE_NAME+ " WHERE ProjectName='" + project_name + "'";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result)
      console.log("deletion successfull");
    });
  });
}


var rows_data = function(data){
  return data
}


var get_all_rows = function(conn, res){
  console.log("get all data");
  conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "SELECT ProjectName FROM " + TABLE_NAME;
    conn.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result)
    })
  });
}


var get_canvas_data = function(conn, project_name, res){
  console.log("get canvas data");
  conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "SELECT * FROM " + TABLE_NAME + " where ProjectName = '" + project_name + "'";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result)
    })
  });
}


module.exports = {
  insert_data:     insert_data,
  get_all_rows:    get_all_rows,
  update_data:     update_data,
  get_canvas_data: get_canvas_data,
  delete_data:     delete_data,
  conn:            conn
}


//create_table(conn())
