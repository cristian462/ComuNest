const db = require('../database/conexion');
const controller = {};

controller.index = (req, res) =>{
	res.send("Ok");
};

controller.usuarios = (req, res) =>{
	try{
		const {nombre, email, pass, foto_perfil} = req.body;
		db.query(`INSERT INTO usuario (nombre, email, pass, foto_perfil, nivel, activo)
				VALUES (?, ?, ?, ?, 1, 1);`,
				[nombre,email,pass,foto_perfil],(err,rows)=>{
					if(err) {
						res.status(400).send(err);
					}
					res.status(201).json({id : rows.insertId});
				});
	} catch(err){
		console.log(err);
		res.status(500).send(err.message);
	}
};

controller.consultar = (req, res) =>{
	try{
		db.query(`SELECT*FROM usuario`,
					(err,rows) =>{
						if(err){
							res.status(400).send(err);
						}
						res.status(200).json(rows);
					}
				);
	}catch(err){
		res.status(500).send(err.message);
	}
};

controller.consultar1 = (req, res) =>{
	try{
		const {id_user} = req.body;
		db.query(`SELECT*FROM usuario
				  WHERE id_user = ?`,
				[id_user],(err,rows) =>{
						if(err){
							res.status(400).send(err);
						}
						res.status(200).json(rows);
					}
				);
	}catch(err){
		res.status(500).send(err.message);
	}
}

module.exports = controller;