const express = require('express');
const router = express.Router();

const login = require('../middleware/login');
const produtosController = require('../controllers/produtos-controller');



// RETORNA TODOS OS PRODUTOS
router.get('/', produtosController.getProdutos);

// INSERE UM PRODUTO
router.post('/', login.obrigatorio, produtosController.postProduto);

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', produtosController.getUmProduto);

// ALTERA UM PRODUTO
router.patch('/', login.obrigatorio, produtosController.updadeProduto);

// EXCLUI UM PRODUTO
router.delete('/', login.obrigatorio, produtosController.deleteProduto);


module.exports = router;