let port = process.env.PORT;
if (port == null) {
   port = 3100;
};

//requried
const express = require('express');

const mongoOptions = {useUnifiedTopology : true, authSource : "admin"};
const connectionString = process.env.CONNECTIONSTRING;

const MongoClient = require('mongodb').MongoClient;

const redis = require("redis");
const client = redis.createClient(process.env.RDPORT, process.env.RDADDRESS);

const usercreate = require('./user-create.js');	
const userlogin = require('./user-login.js');		
const userupdate = require('./user-update.js');
const userget = require('./user-get.js');
const userfind = require('./user-findbyname.js');
const connect = require('./connect.js');

var app = express();

client.on("error", function(error) {
  console.error(error);
});

app.use(express.json());

MongoClient.connect(connectionString, mongoOptions, (err, mongoClient) => {
  const db = mongoClient.db(process.env.DBNAME);
  const gamesCollection = db.collection(process.env.COLNAME);

  usercreate(app, gamesCollection);

  userlogin(app, gamesCollection, client);
  
  userget(app, gamesCollection, client);
  
  userfind(app, gamesCollection, client);
  
  userupdate(app, gamesCollection, client);
  
  connect(app, gamesCollection, client);

  
  //app.post('/api/v1/users/', usercreate);

  //app.put('/api/v1/users/:id', userupdate);

  //app.get('/api/v1/users/:id', userget);

  //app.get('/api/v1/users', userfind);

  //app.post('/api/v1/login', userlogin);

  //app.post('/api/v1/connect', connect);

});
var server = app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`)
})
