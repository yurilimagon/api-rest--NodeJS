const mysql = require('../mysql');

// MOSTRA TODOS OS PRODUTOS(GET)
try {
    exports.getProdutos = async(req,res,next) => {
        const result = await mysql.execute("SELECT * FROM products;")
        const response = {
            quantidade: result.length,
            produtos: result.map(prod => {
                return {
                    productId: prod.productId,
                    name: prod.name,
                    price: prod.price,
                    productImage: prod.productImage,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna um produto específico',
                        url: process.env.URL_API + '/produtos/' + prod.productId
                    }
                }
            })
        }
        return res.status(200).send(response);
    }
} catch (error) {
    return res.status(500).send({ error: error })
}

// INSERE UM NOVO PRODUTO(POST)
exports.postProduto = (req,res,next) => {
    try {
        const query = "INSERT INTO products (name, price, productImage) VALUES (?,?,?)";
        const result =  mysql.execute(query, [req.body.nome, req.body.preco, req.file.path]);
        const response = {
            mensagem: 'Produto inserido com sucesso.',
            produtoCriado: {
                productId: result.productId,
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos',
                    url: process.env.URL_API + '/produtos/'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

// MOSTRA UM PRODUTO ESPECÍFICO(GET)
exports.getUmProduto = async (req,res,next) => {
    try {
        const query = "SELECT * FROM products WHERE idprodutos = ?;";
        const result = await mysql.execute(query, [req.params.id_produto]);
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
                    url: process.env.URL_API + '/produtos'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

// ATUALIZA UM PRODUTO(PATCH)
exports.updadeProduto = async (req,res,next) => {
    try {
        const query = `UPDATE products
                       SET nome = ?, preco = ?
                       WHERE idprodutos = ?`;
        await mysql.execute(query, [
            req.body.nome, 
            req.body.preco,
            req.body.id_produto
        ]);
        const response = {
            mensagem: 'Produto alterado com sucesso.',
            produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna um produto específico',
                    url: process.env.URL_API + '/produtos/' + req.body.id_produto
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

// DEÇETA UM PRODUTO
exports.deleteProduto = async (req,res,next) => {
    try {
        const query = "DELETE FROM products WHERE idprodutos = ?";
        await mysql.execute(query, [req.body.id_produto]);
        const response = {
            mensagem: 'Produto removido com sucesso.',
            request: {
                tipo: 'POST',
                descricao: 'Insere um produto.',
                url: process.env.URL_API + '/produtos',
                body: {
                    nome: 'String',
                    preco: 'Number'
                }
            }
        }
        res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}