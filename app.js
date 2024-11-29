
const express = require('express');
const router = express.Router();
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand(dotenv.config());
const app = express();
const port = process.env.PORT;

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION)
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to DataBase"));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const posts_routes = require('./routes/posts_routes');
app.use('/posts', posts_routes);	

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


