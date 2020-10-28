const mysql = require('../mysql').pool;

exports.getPedidos = (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
                   `SELECT orders.orderId, orders.quantity, products.productId, products.name, products.price
                    FROM orders
                    INNER JOIN products 
                    ON products.productId = orders.productId;`,
            (error, result, field) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            orderId: pedido.orderId,
                            quantity: pedido.quantity,
                            product: {
                                productId: pedido.productId,
                                name: pedido.nomnamee,
                                price: pedido.price
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um pedido específico',
                                url: process.env.URL_API + '/pedidos/' + pedido.orderId
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.postPedidos = (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products WHERE productId = ?;',
        [req.body.productId],
        (error, result, field) => {
            if(error){ return res.status(500).send({ error: error }) } 
            if(result.length == 0){
                return res.status(404).send({
                    mensagem: 'Produto não encontrado'
                });
            } 

            conn.query(
                'INSERT INTO orders (productId, quantity) VALUES (?, ?)',
                [req.body.productId, req.body.quantity],
                (error, result, field) => {
                    conn.release();
                    if(error){ return res.status(500).send({ error: error }) }
                    const response = {
                        mensagem: 'Pedido inserido com sucesso.',
                        pedidoCriado: {
                            orderId: result.orderId,
                            productId: req.body.productId,
                            quantity: req.body.quantity,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: process.env.URL_API + '/pedidos/'
                            }
                        }
                    }
                    return res.status(201).send(response);
                }
            );
        })
    });
}

exports.getUmPedido = (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders WHERE orderId = ?;',
            [req.params.orderId],
            (error, result, field) => {
                if(error){ return res.status(500).send({ error: error }) }
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    });
                }
                const response = {
                    pedido: {
                        orderId: result[0].orderId,
                        productId: result[0].productId,
                        quantity: result[0].quantity,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: process.env.URL_API + '/pedidos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.deletePedido = (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM orders WHERE orderId = ?',
            [req.body.orderId],
            (error, result, field) => {
                conn.release();

                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Pedido removido com sucesso.',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido.',
                        url: process.env.URL_API + '/pedido',
                        body: {
                            productId: 'Number',
                            quantity: 'Number'
                        }
                    }
                }
                res.status(202).send(response);
            }
        );
    });
}