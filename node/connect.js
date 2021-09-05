// required
const data = require('./user-data.js');
const crypto = require('crypto');

module.exports = (app, gamesCollection, client) => {
  app.post('/api/v1/connect', (req, res) => {

    var game_type = req.body.game_type; 
    if (!game_type) {
      res.status(400).send('no game_type');
      return;
    }

    if (req.body.session == null) 
    {
      res.status(401).send('no session');
      return;
    }


    client.get(req.body.session, (error, reply) =>{
      if (error) return console.log(error);

      if (reply == null) 
      {
        res.status(401).send('your session not exist');
        return;
      }

      let fquery = { id : reply };
      let fproject = {
        id : 1,
        username : 1,
        password : 1,
        avatar : 1
      }
      
      gamesCollection.findOne(fquery, fproject)
      .then(result => {
        var plaintextToken = result.username + result.avatar + req.body.game_type + process.env.SECRET;
        var token = crypto.createHash('sha256').update(plaintextToken).digest('base64');  

        res.status(200).json({
          username:   result.username,
          avatar:     result.avatar,
          game_port:  parseInt(process.env.GAMEPORT),
          token:      token
        })
      })
      .catch(err => {
        console.error(`fail : ${err}`);
      });
    });
  });
};
