//required
const data = require('./user-data.js');

module.exports = (app, gamesCollection, client) => {
  
  app.put('/api/v1/users/:id', (req, res) => {

    if (!req.body.session)
    {
      res.status(401).send('your session not exist');
      return;
    }
    
    let fquery = { id : req.params.id };
    let fproject = {
      id : 1,
      username : 1,
      password : 1,
      avatar : 1
    }

    gamesCollection.findOne(fquery, fproject)
    .then(result => {
      
      client.get(req.body.session, (error, reply) =>{
        if (error) return console.log(error);

        if (reply == null) 
        {
          res.status(401).send('your session not exist');
        }
        else
        {
          if(result) 
          {
            if(req.params.id == reply)
            {
              let query = { id : req.params.id };
              let setCommand = { $set : { id : req.params.id, username : req.body.username, password : req.body.password, avatar : req.body.avatar } };
              let setOptions = { upsert: true, returnOriginal: false };
              
              gamesCollection.findOneAndUpdate(query, setCommand, setOptions, (err, result) => {
                  res.send(result.value);
              });
            }
            else {
              res.status(403).send('Only the owner of the session may update itself');
            }
          } 
          else 
          {
            res.status(404).send('not exist');
          }
        }
      });
    })
    .catch(err => {
      console.error(`fail : ${err}`);
    });
    
  });
};