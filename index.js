import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';

//import models and routes
import Game from './app/models/game';
import {getGames, getGame, postGame, deleteGame} from './app/routes/game';

//express server is here
const app = express();
const port = process.env.PORT || 8080;

//DB connection through mongoose
const options =
{
  server: {socketOptions: { keepAlive: 1, connectTimeoutMS: 30000} },
  replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000} }
}; //just a bunch of options for the db connection
mongoose.Promise = global.Promise;
//dont forget to subsitute it with your connection string
mongoose.connect('localhost:27017', options); //make local host on this laptop or else it will break
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//body parser and morgan middleware
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json() );
app.use(morgan('dev') );

//next we tell express where to find static assests
app.use(express.static(__dirname + '/client/dist') );

//enable CORS so that we can HTTP request from webpack-dev-server
app.use((req, res, next) =>
{
  res.header("Access-Control-Allow-Origin", "*"); //interprets star as philscreen?
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept");
  next();
});

//API routes
app.route('/games')
//create a game
.post(postGame)
//get all the games
.get(getGames);
app.route('/games/:id')
//get a single game
.get(getGame)
//delete a single game
.delete(deleteGame);

//...for all the other requests just sends back the Homepage
app.route("*").get((req, res) =>
{
  res.sendFile('client/dist/index.html', {root: __dirname});
});

app.listen(port);

console.log(`listening on port ${port}`);
