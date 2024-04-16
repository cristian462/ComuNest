const express = require('express');
const cors = require('cors');
const config = require('./config');
const path = require('path');

const app = express();

app.use(express.json());

app.use(cors());

app.set('port', config.app.port);

app.use(require('./routes/index.routes'));

app.use(express.static(path.join(__dirname,'../public')));

app.use((req, res)=>{
	res.sendFile(path.join(__dirname,'../public/404.html'))
})

module.exports = app;
