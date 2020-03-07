import UserInfoModel from '../models/userInfo';
import ProductModel from '../models/product';
import CommentModel from '../models/comment';
import BuyModel from '../models/buy';
import product from './product';


class Management {
    constructor() {

    }

    async getUsersCount(req, res, next) {
        try {
            const count = await UserInfoModel.find().count();
            res.sendStatus({
                status: 1,
                total: count,
            });
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async getAllUsers(req, res, next) {
        const { page, pageSize } = req.query;
        const p = parseInt(page) || 1;
        const size = parseInt(pageSize) || 10;
        const skip = (p - 1) * size;
        try {
            const list = await UserInfoModel.find().skip(skip).limit(size);
            res.sendStatus(
                list
            );
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async getProductsCount(req, res, next) {
        try {
            const count = await ProductModel.find().count();
            res.sendStatus({
                status: 1,
                total: count,
            });
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async getAllProducts(req, res, next) {
        const { page, pageSize } = req.query;
        const p = parseInt(page) || 1;
        const size = parseInt(pageSize) || 10;
        const skip = (p - 1) * size;
        try {
            const list = await ProductModel.find().skip(skip).limit(size).sort({'_id': -1});
            res.sendStatus(
                list
            );
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async changeProductChecked(req, res, next) {
        const { product_id, isCheck } = req.params;
        try{
            if(!product_id) {
                throw new Error('缺少产品参数');
            }
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: err.message,
            })
            return;
        }
        try {
            if(isCheck === 'true') {
                await ProductModel.findOneAndUpdate({product_id},{isCheck: false});
            }else {
                console.log(false);
                await ProductModel.findOneAndUpdate({product_id},{isCheck: true});
            }
            res.sendStatus({
                status: 1,
                type: 'SUCCESS',
            })
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'FAIL_CHANGE',
                message: err.message,
            })
            return;
        }
    }

    async getCommentCount(req, res, next) {
        try {
            const count = await CommentModel.find().count();
            res.sendStatus({
                status: 1,
                total: count,
            });
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async getAllComments(req, res, next) {
        const { page, pageSize } = req.query;
        const p = parseInt(page) || 1;
        const size = parseInt(pageSize) || 10;
        const skip = (p - 1) * size;
        try {
            const list = await CommentModel.find().skip(skip).limit(size).sort({'_id': -1});
            res.sendStatus(
                list
            );
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async delComments(req, res, next) {
        const { comment_id } = req.params;
        if(!comment_id) {
            res.sendStatus({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try {
            await CommentModel.findOneAndRemove({comment_id});
            res.sendStatus({
                status: 1,
                success: '删除评论成功',
            })
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_DELETE',
                message: err.message,
            })
        }
    }

    async getOrdersCount(req, res, next) {
        try {
            const count = await BuyModel.find().count();
            res.sendStatus({
                status: 1,
                total: count,
            });
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async getAllUsers(req, res, next) {
        const { page, pageSize } = req.query;
        const p = parseInt(page) || 1;
        const size = parseInt(pageSize) || 10;
        const skip = (p - 1) * size;
        try {
            const list = await UserInfoModel.find().skip(skip).limit(size);
            res.sendStatus(
                list
            );
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }
}

export default new Management();