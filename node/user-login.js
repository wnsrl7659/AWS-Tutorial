//required
const data = require('./user-data.js');
var uuid4 = require('uuid4');

function sData(id, session) {
  this.id = id;
  this.session = session;
}

function buildResult(id, session) {
    let result = {};
    result["id"] = id;
    result["session"] = session;
    return result;
}

lastsession = {}
scount = 0;


function findlastssbyid(id) {
  for(i = 0; i < scount; i++)
  {
    if(lastsession[i].id == id)
    {
      return i;
    }
  }
  return -1;
}
  
module.exports = (app, gamesCollection, client) => {

  app.post('/api/v1/login', (req,res) => {

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
        if(result.password == req.body.password)
        {
          var ss = uuid4();
          var loc = findlastssbyid(result.id);

          if(loc != -1)
          {
            client.del(lastsession[loc].session, (err, reply) => {});
          }

          client.set(ss, result.id, (error, reply) =>{
            if (error) return console.log(error);
            client.expire(ss, process.env.RDEXPIRE);

            if(loc == -1)
            {
              lastsession[scount] = new sData(result.id, ss);
              scount++;
            }
            else
            {
              lastsession[loc].session = ss;
            }

            let final = buildResult(result.id, ss);
            res.send(final); 
          });
          
        }
        else
        {
          res.status(403).send('bad password');
        }
      } 
      else 
      {
        res.status(400).send('bad username');
      }
    })
    .catch(err => {
      console.error(`fail : ${err}`);
    });
  });
};