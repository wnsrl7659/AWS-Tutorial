//required
const data = require('./user-data.js');

module.exports = (app, gamesCollection, client) => {
  
  app.get('/api/v1/users/:id', (req,res) => {

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
              res.send(result);
            }
            else {
              data.otheruser.id = result.id;
              data.otheruser.username = result.username;
              data.otheruser.avatar = result.avatar;
              res.send(data.otheruser);
            }
          } 
          else 
          {
            res.status(404).send('id not exist');
          }
        }
      });
    })
    .catch(err => {
      console.error(`fail : ${err}`);
    });
  });
};