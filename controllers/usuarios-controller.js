const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results) => {
            if(error){ return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                res.status(401).send({ mensagem: 'Usuário já cadastrado' });
            } else{
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                                `INSERT INTO users (email, password) VALUES (?,?)`,
                                 [req.body.email, hash],
                        (error, results) => {
                        conn.release();
                        if(error){ return res.status(500).send({ error: error }) }
                        response = {
                            mensagem: 'Usuário criado com sucesso',
                            usuarioCriado: {
                                userId: results.insertId,
                                email: req.body.email
                            }
                        }
                        return res.status(201).send(response);
                        }
                    );
                });
            }
        });
    });        
}

exports.login = (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        const query = `SELECT * FROM users WHERE EMAIL = ?`;
        conn.query(query,[req.body.email], (error, results, fields) => {
            conn.release();
            if(error) { return res.status(500).send({ error: error}) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            }
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if(err){
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                }
                if (result) {
                    let token = jwt.sign({
                        userId: results[0].userId,
                        email: results[0].email
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            });
        });
    });
}