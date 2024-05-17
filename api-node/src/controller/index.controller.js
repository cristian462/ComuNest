const db = require('../database/conexion');
const path = require('path');
const bcrypt = require('../helper/handlerBcrypt');
const { log } = require('console');
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
						res.json({login: 0});
					}else{
						const success = await bcrypt.compare(pass,rows[0].pass);
						if(!success){
							res.json({login: 0});
						}else{
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
				VALUES (?,?,?,0);`,
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

controller.listaCasas = async (req, res) => {
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
			res.status(200).json(rows)
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
			WHERE m.id_casa = ?
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
					}
				});
				res.status(200).json({id_casa: rows[0].id_casa});
			});
		});
	}catch(err){
		console.log(err.message);
	}
};

controller.searchCasas = async(req, res) =>{
	try {
		const { nombre } = req.body;
		db.query(`
		  SELECT id_casa, nombre FROM casa
		  WHERE LOWER(nombre) LIKE ?; 
		`, [`%${nombre}%`], (err, rows) => {
		  if (err) {
			console.error('Error al buscar casas:', err);
			return res.status(500).json({ error: 'Error interno del servidor' });
		  }
		  res.status(200).json(rows);
		});
	  } catch (error) {
		console.error('Error al buscar casas:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	  }
};

controller.compruebaCasa = async(req,res) =>{
	try{
		const {nombre} = req.body;
		db.query(`
			SELECT id_casa FROM casa WHERE nombre = ?;
		`,[nombre],(err,rows)=>{
			if(rows[0]){
				res.status(200).json({existe: 1});
			}else{
				res.status(200).json({existe: 0});
			}
		});
	} catch (error) {
		console.error('Error al buscar casas:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	  }
};

controller.casaLogin = async(req,res) =>{
	try{
		const {id_user,id_casa,pass} = req.body;
		db.query(`
			SELECT pass FROM casa WHERE id_casa = ?;
		`, [id_casa],async(err,rows)=>{
			const success = await bcrypt.compare(pass,rows[0].pass);
			if(!success){
				res.status(200).json({exito: 0});
			}else{
				db.query(`
					INSERT INTO casa_user (id_casa, id_user)
					VALUES (?, ?);
				`,[id_casa,id_user],(err,rows)=>{
					db.query(`
						SELECT MAX(id_mes) AS id_mes FROM mes WHERE id_casa = ?;
					`,[id_casa],(err,rows)=>{
						db.query(`
							INSERT INTO gasto (nombre,descripcion,importe, id_user, id_casa, id_mes)
							VALUES ('Nuevo mes','Nuevo mes',0,? ,? ,?);
						`,[id_user,id_casa,rows[0].id_mes],(err,rows)=>{
						});
					});
					res.status(200).json({exito: 1,});
				});
			}
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.compruebaUsers = async(req,res)=>{
	try{
		const { id_casa } = req.body;
		db.query(`
			SELECT u.nombre
			FROM usuario u
			JOIN casa_user cu ON u.id_user = cu.id_user
			WHERE cu.id_casa = ?;
		`,[id_casa],(err,rows)=>{
			if(rows){
				res.status(200).json(rows);
			}else{
				res.status(404);
			}
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.gastos = async(req,res)=>{
	try{
		const { id_mes } = req.body;
		db.query(`
			SELECT g.id_gasto ,g.nombre,g.descripcion,g.importe,u.nombre AS nombre_user FROM gasto g
			INNER JOIN usuario u ON g.id_user = u.id_user
			WHERE g.id_mes = ?;
		`,[id_mes],(err,rows)=>{
			if(rows){
				res.status(200).json(rows);
			}else{
				res.status(404);
			}
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.resolver = async(req,res)=>{
	try{
		const {id_mes} = req.body
		db.query(`
			UPDATE mes
			SET resuelto = 1
			WHERE id_mes = ?;
			`,[id_mes],(err,rows)=>{
			if(err){
				res.status(200).json({resuelto: 0});
			}else{
				res.status(200).json({resuelto: 1});
			}
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.gastoNuevo = async(req,res)=>{
	try{
		const {nombre, descripcion, importe, id_user, id_casa, id_mes} = req.body
		db.query(`
			INSERT INTO gasto (nombre, descripcion, importe, id_user, id_casa, id_mes)
			VALUES (?,?,?,?,?,?)
			`,[nombre, descripcion, importe, id_user, id_casa, id_mes],(err,rows)=>{
			if(err){
				res.status(200).json({exito: 0});
			}else{
				res.status(200).json({exito: 1});
			} 
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.borrarGasto = async(req,res)=>{
	try{
		const {id} = req.body
		db.query(`
				DELETE FROM gasto WHERE id_gasto = ?;
			`,[id],(err,rows)=>{
			if(err){
				res.status(200).json({exito: 0});
			}else{
				res.status(200).json({exito: 1});
			} 
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.borrarCasa = async(req,res)=>{
	try{
		const {id_casa} = req.body
		db.query(`
				DELETE FROM casa WHERE id_casa = ?;
			`,[id_casa],(err,rows)=>{
			if(err){
				res.status(200).json({exito: 0});
			}else{
				res.status(200).json({exito: 1});
			} 
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.allCasas = async(req,res)=>{
	try{
		db.query(`
				SELECT id_casa,nombre FROM casa
			`,(err,rows)=>{
			if(err){
				res.status(404);
			}else{
				res.status(200).json(rows);
			} 
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.listaIntegrantes = async (req,res)=>{
	try{
		const {id_casa} = req.body
		db.query(`
				SELECT u.nombre, c.id_user FROM casa_user c
				INNER JOIN usuario u ON u.id_user = c.id_user
				WHERE c.id_casa = ?
			`,[id_casa],(err,rows)=>{
			if(err){
				res.status(404);
			}else{
				res.status(200).json(rows);
			} 
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.borrarIntegrante = async(req,res)=>{
	try{
		const {id_casa, id_user} = req.body
		db.query(`
				DELETE FROM casa_user
				WHERE id_casa = ? AND id_user = ?;
			`,[id_casa, id_user]);
		db.query(`
				DELETE FROM gasto
				WHERE id_casa = ? AND id_user = ?;
				`,[id_casa, id_user]);
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

controller.casasUsuario = async(req,res)=>{
	try{
		const {id} = req.body
		db.query(`
				SELECT id_casa FROM casa_user WHERE id_user = ?
			`,[id],(err,rows)=>{
			if(err){
				res.status(404);
			}else{
				res.status(200).json(rows);
			} 
		});
	}catch(err){
		console.error('Error al buscar casas:', err);
		res.status(500).json({ err: 'Error interno del servidor' });
	}
};

module.exports = controller;