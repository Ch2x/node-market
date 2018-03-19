import express from 'express';
import Product from '../controller/product';

const router = express.Router();

router.post('/release', Product.publicProduct);
router.get('/getProducts', Product.getProducts);
router.get('/getAllProducts', Product.getAllProducts);
router.get('/getDetail', Product.getDetail);
router.get('/searchProduct', Product.searchProduct);
router.delete('/delProduct/:user_id/:product_id', Product.delProduct);
router.post('/updateProduct/:product_id', Product.updateProduct);

export default router;