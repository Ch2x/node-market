import express from 'express'
import Cart from '../controller/cart'

const router = express.Router();

router.post('/addCart', Cart.addCart);
router.get('/getAddState/:user_id/:product_id', Cart.getAddState);

export default router;