//we import our game Schema
import Game from '../models/game';

//get all the games sorted by portDate
const getGames = (req, res) => {
  //query the db, if no errors, send all the games to the client
  Game.find(null, null, {sort: {postDate:1} }, (err,games) => {
    if(err) {
      res.send(err);
    }
    res.json(games); //games sent as json
  });
}

//get a single game filtered by ID
const getGame = (req, res) =>
{
  const { id } = req.params;
  //query the database for a single game. if no errors sent it to client
  Game.findById(id, (err, game) =>
  {
    if(err)
    {
      res.send(err);
    }
    res.json(game); //game sent as json
  });
}

//get the body data and create a new game
const postGame = (req, res) =>
{ //we assign the game info to a empty game and send message back if no errors
  let game = Object.assign(new Game(), req.body);
  //next save it into the database
  game.save(err =>
      {
        if(err)
        {
          res.send(err);
        }
      res.json( {message: 'game created' });
    });
};

//delete a game by the given ID
const deleteGame = (req, res) =>
{ //we remove the game by the given ID and send a message back if no errors
  Game.remove(
    { _id: req.params.id},
    err =>
      {
        if(err)
        {
          res.send(err);
        }
        res.json( {message: 'successfully deleted'}); //a simple JSON answer to inform the client
      }
  );
};

//we export our functions to be used in the server routes
export {getGames, getGame, postGame, deleteGame};
