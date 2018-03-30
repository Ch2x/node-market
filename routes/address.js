import express from 'express'
import Address from '../controller/address'

const router = express.Router();

router.post('/postAddress', Address.postAddress);
router.get('/getMyAddress', Address.getMyAddress);
router.delete('/delAddress/:user_id/:address_id', Address.delAddress);
export default router;
