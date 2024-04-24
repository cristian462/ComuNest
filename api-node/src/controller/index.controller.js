const db = require('../database/conexion');
const path = require('path');
const bcrypt = require('../helper/handlerBcrypt');
const saveFile = require('../helper/handlerSaveImage');
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
		SELECT 
    casa.nombre AS nombre_casa,
    gasto.nombre AS nombre_gasto,
    gasto.descripcion AS descripcion_gasto,
    gasto.importe AS importe_gasto
FROM 
    casa
JOIN casa_user ON casa.id_casa = casa_user.id_casa
JOIN gasto ON casa.id_casa = gasto.id_casa
WHERE 
    casa_user.id_user = ?;


	`, [id_user], (err, rows) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                if (!rows || rows.length === 0) {
                    res.json({ casas: [] });
                } else {
                    const result = {};
                    result.casa = {};
                    rows.forEach(row => {
                        if (!result.casa[row.nombre_casa]) {
                            result.casa[row.nombre_casa] = {
                                nombre_ultimo_mes: row.nombre_ultimo_mes,
                                resuelto_ultimo_mes: row.resuelto_ultimo_mes,
                                gastos: []
                            };
                        }
                        result.casa[row.nombre_casa].gastos.push({
                            nombre_gasto: row.nombre_gasto,
                            descripcion_gasto: row.descripcion_gasto,
                            importe_gasto: row.importe_gasto
                        });
                    });
                    res.json(result);
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}


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