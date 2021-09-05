//required
var base64url = require('base64url');

module.exports = (app, gamesCollection) => {
  app.post('/api/v1/users/', (req, res) => {
    
    let fquery = { username : req.body.username };
    let fproject = {
      id : 1,
      username : 1,
      password : 1,
      avatar : 1
    }

    gamesCollection.findOne(fquery, fproject)
    .then(result => {
      if(result) 
      {
        res.status(409).send('already exist');
      } 
      else 
      {
        let query = { username : req.body.username };
        let setCommand = { $set : { id : base64url(req.body.username), username : req.body.username, password : req.body.password, avatar : req.body.avatar } };
        let setOptions = { upsert: true, returnOriginal: false };
        
        gamesCollection.findOneAndUpdate(query, setCommand, setOptions, (err, result) => {
            res.send(result.value);
        });
      }
    })
    .catch(err => {
      console.error(`fail : ${err}`);
    });
  });
};