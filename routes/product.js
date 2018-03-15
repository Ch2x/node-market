import express from 'express';
import Product from '../controller/product';

const router = express.Router();

router.post('/release', Product.publicProduct);
router.get('/getProducts', Product.getProducts);
router.get('/getAllProducts', Product.getAllProducts);
router.get('/getDetail', Product.getDetail);
router.get('/searchProduct', Product.searchProduct);

export default router;