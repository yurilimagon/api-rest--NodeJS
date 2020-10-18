const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS
router.get('/', (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
                   `SELECT pedidos.idpedidos, pedidos.quantidade, produtos.idprodutos, produtos.nome, produtos.preco
                    FROM pedidos
                    INNER JOIN produtos 
                    ON produtos.idprodutos = pedidos.idprodutos;`,
            (error, result, field) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.idpedidos,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.idprodutos,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um pedido específico',
                                url: 'http://localhost:3000/pedidos/' + pedido.idpedidos
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
});

// INSERE UM PEDIDO
router.post('/', (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM produtos WHERE idprodutos = ?;',
        [req.body.id_produto],
        (error, result, field) => {
            if(error){ return res.status(500).send({ error: error }) } 
            if(result.length == 0){
                return res.status(404).send({
                    mensagem: 'Produto não encontrado'
                });
            } 

            conn.query(
                'INSERT INTO pedidos (idprodutos, quantidade) VALUES (?, ?)',
                [req.body.id_produto, req.body.quantidade],
                (error, result, field) => {
                    conn.release();
                    if(error){ return res.status(500).send({ error: error }) }
                    const response = {
                        mensagem: 'Pedido inserido com sucesso.',
                        pedidoCriado: {
                            id_pedido: result.idpedidos,
                            id_produto: req.body.id_produto,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://localhost:3000/pedidos/'
                            }
                        }
                    }
                    return res.status(201).send(response);
                }
            );
        })
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pedidos WHERE idpedidos = ?;',
            [req.params.id_pedido],
            (error, result, field) => {
                if(error){ return res.status(500).send({ error: error }) }
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    });
                }
                const response = {
                    pedido: {
                        id_pedido: result[0].idpedidos,
                        id_produto: result[0].idprodutos,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});

// ALTERA UM PEDIDO
router.patch('/', (req,res,next) =>{
    res.status(201).send({
        mensagem: 'PEDIDO alterado'
    });
});
// APAGA UM PEDIDO
router.delete('/', (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM pedidos WHERE idpedidos = ?',
            [req.body.id_pedido],
            (error, result, field) => {
                conn.release();

                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Pedido removido com sucesso.',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido.',
                        url: 'http://localhost:3000/pedido',
                        body: {
                            id_produto: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                res.status(202).send(response);
            }
        );
    });
});    

module.exports = router;