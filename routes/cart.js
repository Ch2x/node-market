import express from 'express'
import Cart from '../controller/cart'

const router = express.Router();

router.post('/addCart', Cart.addCart);
router.get('/getAddState/:user_id/:product_id', Cart.getAddState);
router.get('/getMyCart', Cart.getMyCart);
router.delete('/delShopCart/:user_id/:products', Cart.delShopCart);

export default router;