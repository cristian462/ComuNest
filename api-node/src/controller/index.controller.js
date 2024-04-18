const db = require('../database/conexion');
const path = require('path');
const bcrypt = require('../helper/handlerBcrypt');
const saveFile = require('../helper/handlerSaveImage');
const controller = {};

controller.index = (req, res) =>{
	res.send("Ok");
};

controller.login = async (req, res) =>{
	try{
		const {email,pass} = req.body;
		db.query(`SELECT email, pass FROM usuario
				  WHERE email=?`,
				 [email], async(err,rows)=>{
					if(err) {
						res.status(400).send(err.message);
					}
					if(rows.length===0){
						//no coincide ningun correo
						res.json({login: 0});
					}

					//comparamos contraseñas
					const success = await bcrypt.compare(pass,rows[0].pass);
					if(!success){
						//no coinciden las contraseñas
						res.json({login: 1});
					}else{
						//éxito
						res.json({login: 2});
					}
				 } 
				  )
	}catch(err){
		res.status(500).send(err.message);
	}
}

controller.registro = async (req, res) =>{
	try{
		const {nombre, email, pass} = req.body.datos;
		let foto_perfil = req.file ? req.file.originalname : 'unknown.jpg';
		if(req.file){
			const extension = path.extname(req.file.originalname);
			const nombreunico = `${Date.now()}-${Math.round(Math.random()*1E9)}${extension}`;
			foto_perfil = nombreunico;
			saveFile.saveImage(req.file,'perfil',foto_perfil);
		}

		const hash = await bcrypt.encrypt(pass);
		db.query(`SELECT id_user FROM usuario WHERE email=?`,[email],(err,rows)=>{
			if(rows.length === 0){
				db.query(`INSERT INTO usuario (nombre,email,pass,foto_perfil,nivel)
				VALUES (?,?,?,?,1);`,
				[nombre,email,hash,foto_perfil],(err,rows)=>{
					if(err) {
						res.status(400).send(err.message);
					}
					res.status(201).json({success : 1});
				});
			}else{
				res.json({msg : "El usuario ya existe"});
			}
		});	
	} catch(err){
		res.status(500).send(err.message);
	}
};

controller.fotoperfil = (req,res) =>{
	try{
		console.log(req.file.filename);
		
		res.send('Termina');
	}catch(err){
		console.log(err.message);
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