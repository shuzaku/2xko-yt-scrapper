//controllers
const ProReplays = require("../handler/2xko-pro-replays");
const BestOfReplays = require("../handler/best-of-2xko-replays");

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

let dotenv = require('dotenv');
dotenv.config();
require('module-alias/register');
var connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vdh52.mongodb.net/Fighters-Edge?retryWrites=true&w=majority`;
var mongoose = require('mongoose');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())


mongoose.connect(connectionString);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("Connection Succeeded");
  run();
});

app.listen(process.env.PORT || 8082);

function run() {
  ProReplays();
  BestOfReplays();
}

// app.listen(process.env.PORT || 80);   

