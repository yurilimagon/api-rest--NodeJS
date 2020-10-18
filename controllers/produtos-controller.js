const mysql = require('../mysql').pool;

exports.getProdutos = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, field) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.idprodutos,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um produto específico',
                                url: process.env.URL_API + 'produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.postProduto = (req,res,next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, field) => {
                conn.release();

                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso.',
                    produtoCriado: {
                        id_produto: result.idprodutos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: process.env.URL_API + 'produtos/'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        );
    });
}

exports.getUmProduto = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE idprodutos = ?;',
            [req.params.id_produto],
            (error, result, field) => {
                if(error){ return res.status(500).send({ error: error }) }
                
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    });
                }
                const response = {
                    produto: {
                        id_produto: result[0].idprodutos,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: process.env.URL_API + 'produtos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.updadeProduto = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
             SET nome = ?,
                 preco = ?
             WHERE idprodutos = ?`,
            [
                req.body.nome, 
                req.body.preco,
                req.body.id_produto
            ],
            (error, result, field) => {
                conn.release();

                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto alterado com sucesso.',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto específico',
                            url: process.env.URL_API + 'produtos/' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response);
            }
        );
    });
}

exports.deleteProduto = (req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM produtos WHERE idprodutos = ?',
            [req.body.id_produto],
            (error, result, field) => {
                conn.release();

                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso.',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto.',
                        url: process.env.URL_API + 'produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                res.status(202).send(response);
            }
        );
    });
}