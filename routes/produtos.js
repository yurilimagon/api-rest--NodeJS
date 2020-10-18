const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const produtosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function(re,file,cb){
        cb(null, './uploads/');
    },
    filename: function(re,file,cb){
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const fileFilter = (req,file,cb) => {
    if (file.mimetipe === 'image/jpeg' || file.mimetipe === 'image/png') {
        cb(null, true);
    } else{
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: (1024 * 1024) * 5
    },
    fileFilte: fileFilter
});

// RETORNA TODOS OS PRODUTOS
router.get('/', produtosController.getProdutos);

// INSERE UM PRODUTO
router.post('/', login.obrigatorio, upload.single('produto_imagem'), produtosController.postProduto);

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', produtosController.getUmProduto);

// ALTERA UM PRODUTO
router.patch('/', login.obrigatorio, produtosController.updadeProduto);

// EXCLUI UM PRODUTO
router.delete('/', login.obrigatorio, produtosController.deleteProduto);


module.exports = router;