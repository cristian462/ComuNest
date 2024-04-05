const express = require('express');
const config = require('./config');
const path = require('path');

const app = express();

app.set('port', config.app.port);

app.use(require('./routes/index.routes'));

app.use(express.static(path.join(__dirname,'../public')));

app.use((req, res)=>{
	res.sendFile(path.join(__dirname,'../public/404.html'))
})

module.exports = app;
