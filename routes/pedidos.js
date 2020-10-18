const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos-controller');

// RETORNA TODOS OS PEDIDOS
router.get('/', pedidosController.getPedidos);

// INSERE UM PEDIDO
router.post('/', pedidosController.postPedidos);

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', pedidosController.getUmPedido);

// ALTERA UM PEDIDO
/*router.patch('/', (req,res,next) =>{
    res.status(201).send({
        mensagem: 'PEDIDO alterado'
    });
});*/
// APAGA UM PEDIDO
router.delete('/', pedidosController.deletePedido);    

module.exports = router;