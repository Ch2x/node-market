import express from 'express';
import Management from '../controller/management'
import Sort from '../controller/sort'

const router = express.Router();

router.get('/getAllUsers', Management.getAllUsers);
router.get('/getUsersCount', Management.getUsersCount);
router.get('/getAllProducts', Management.getAllProducts);
router.get('/getProductsCount', Management.getProductsCount);
router.get('/changeProductChecked/:product_id/:isCheck', Management.changeProductChecked);
router.get('/getAllComments', Management.getAllComments);
router.get('/getCommentCount', Management.getCommentCount);
router.delete('/delComments/:comment_id', Management.delComments);
router.get('/getAllSorts', Sort.getAllSorts);
router.get('/getSortCount', Sort.getSortCount);
router.get('/addSort', Sort.addSort);
router.post('/editSort', Sort.editSort);
router.get('/getAllUsers', Management.getAllUsers);
router.get('/getOrdersCount', Management.getOrdersCount);
export default router;