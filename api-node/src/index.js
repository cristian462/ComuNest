const app = require('./app');

app.listen(app.get('port'),()=>{
	console.log("Servidorn en ", app.get("port"));
})