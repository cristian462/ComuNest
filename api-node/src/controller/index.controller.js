const db = require('../database/conexion');
const path = require('path');
const bcrypt = require('../helper/handlerBcrypt');
const saveFile = require('../helper/handlerSaveImage');
const { log } = require('console');
const { ok } = require('assert');
const controller = {};

controller.index = (req, res) =>{
	res.send("Ok");
};

controller.login = async (req, res) =>{
	try{
		const {email,pass} = req.body;
		db.query(`SELECT id_user,nombre,pass,nivel FROM usuario
				  WHERE email=?`,
				 [email], async(err,rows)=>{
					if(err) {
						res.status(400).send(err.message);
					}
					if(!rows || rows.length === 0){
						//no coincide ningun correo
						res.json({login: 0});
					}else{
						//comparamos contraseñas
						const success = await bcrypt.compare(pass,rows[0].pass);
						if(!success){
							//no coinciden las contraseñas
							res.json({login: 0});
						}else{
							//éxito
							res.json({
								login: 1,
								usuario: {
									id_user: rows[0].id_user,
									nombre: rows[0].nombre,
									nivel: rows[0].nivel
								}
							});
						}
					}
				 }
				  )
	}catch(err){
		res.status(500).send(err.message);
	}
}

controller.registro = async (req, res) =>{
	try{
		const {nombre, email, pass} = req.body;
		const hash = await bcrypt.encrypt(pass);
		db.query(`SELECT id_user FROM usuario WHERE email=?`,[email],(err,rows)=>{
			if(rows.length === 0){
				db.query(`INSERT INTO usuario (nombre,email,pass,nivel)
				VALUES (?,?,?,1);`,
				[nombre,email,hash],(err,rows)=>{
					if(err) {
						res.status(400).send(err.message);
					}

					res.status(201).json({id : rows.insertId});
				});
			}else{
				res.json({msg : "El usuario ya existe"});
			}
		});
	} catch(err){
		res.status(500).send(err.message);
	}
};

controller.listadoCasas = async (req, res) => {
    try {
        const { id_user } = req.body;
        db.query(`
			SELECT g.id_casa,c.nombre AS casa,g.id_mes,m.nombre,m.resuelto, SUM(g.importe) AS total FROM gasto g
			INNER JOIN casa c ON g.id_casa = c.id_casa
			INNER JOIN mes m ON g.id_mes = m.id_mes
			WHERE g.id_mes = (select max(g2.id_mes) FROM gasto g2 where g2.id_casa = g.id_casa)
			AND id_user = ?
			GROUP BY id_casa,id_mes;
	`, [id_user], (err, rows) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
				res.status(200).json(rows)
            }
        });
    } catch (err) {
        console.log(err);
    }
};
 
controller.casa = async (req,res) =>{
	try{
		const { id_casa } = req.body;
		db.query(`
			SELECT m.id_mes, m.nombre, m.resuelto, SUM(g.importe) AS total FROM mes m 
			INNER JOIN gasto g ON m.id_mes = g.id_mes
			WHERE m.id_casa = 1
			GROUP BY m.id_mes
			ORDER BY m.id_mes DESC;
		`, [id_casa],(err,rows)=>{
			if(err) {
				res.status(400).send(err.message);
			} else {
				res.status(200).json(rows)
            }
		});
	}catch (err) {
        console.log(err);
    }
};

controller.nuevoMes = (req,res) =>{
	try{
		const {id_casa, nombre, id_user} = req.body;
		db.query(`
			INSERT INTO mes (nombre, resuelto, id_casa)
			VALUES (?, 0, ?);
		`, [nombre,id_casa],(err,rows)=>{
			if(err) {
				res.status(400).send(err.message);
			} else {
				db.query(`
					SELECT MAX(id_mes) AS id_mes FROM mes WHERE nombre = ? AND id_casa = ?;
				`, [nombre,id_casa],(err,rows)=>{
					db.query(`
						INSERT INTO gasto (nombre,descripcion,importe, id_user, id_casa, id_mes)
						VALUES ('Nuevo mes','Nuevo mes',0,? ,? ,?);
					`,[id_user,id_casa,rows[0].id_mes],(err,rows)=>{
						if(err) {
							res.status(400).send(err.message);
						} else {
							res.status(200).send("ok");
						}
					});
				});
            }
		});
	}catch(err){
		console.log(err.message);
	}
};

controller.nuevaCasa = async(req,res) =>{
	try{
		const {id_user, nombre, pass} = req.body;
		const hash = await bcrypt.encrypt(pass);
		db.query(`
			INSERT INTO casa (nombre,pass)
			VALUES(?,?);
		`,[nombre,hash],(err,rows)=>{
			db.query(`
				SELECT MAX(id_casa) AS id_casa FROM casa;
			`,(err,rows)=>{
				db.query(`
					INSERT INTO casa_user (id_casa,id_user)
					VALUES (?,?);
				`,[rows[0].id_casa,id_user],(err,rows)=>{
					if(err) {
						res.status(400).send(err.message);
					} else {
						res.status(200).send("ok");
					}
				});
			});
		});
	}catch(err){
		console.log(err.message);
	}
};

module.exports = controller;