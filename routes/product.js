import express from 'express';
import Product from '../controller/product';
import Buy from '../controller/buy';

const router = express.Router();

router.post('/release', Product.publicProduct);
router.get('/getProducts', Product.getProducts);
router.get('/getAllProducts', Product.getAllProducts);
router.get('/getDetail', Product.getDetail);
router.get('/searchProduct', Product.searchProduct);
router.delete('/delProduct/:user_id/:product_id', Product.delProduct);
router.post('/updateProduct/:product_id', Product.updateProduct);
router.get('/getOrderInfo', Product.getOrderInfo);
router.post('/confirmOrder', Buy.confirmOrder);
router.get('/getMyBuy', Buy.getMyBuy);
router.get('/getMySold', Buy.getMySold);

export default router;