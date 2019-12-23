import BaseComponent from '../prototype/baseComponent'
import formidable from 'formidable'
import CommentModel from '../models/comment'
import UserInfoModel from '../models/userInfo'
import ProductModel from '../models/product'
import CartModel from '../models/cart'
import product from './product'
import dtime from 'time-formater'

class Cart extends BaseComponent {
    constructor() {
        super();
        this.addCart = this.addCart.bind(this);
    }

    async addCart(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if(err) {
                console.log('formidable解析出错', err);
                res.send({
                    status: 1,
                    message: '解析出错',
                });
                return;
            }
            const { user_id, product_id } = fields;
            try {
                const cart_id = await this.getId('cart_id');
                const newCart = { user_id, product_id, cart_id };
                await CartModel.create(newCart);
                res.send({
                    status: 1,
                    message: '添加购物车成功'
                })
            }catch(err) {
                res.send({
                    status: 0,
                    type: 'FAIL_ADD',
                    message: err.message,
                });
            } 
        })
    }

    async delShopCart(req, res, next) {
        let { products, user_id } = req.params;
        products = products.split(',')
        if( !products || !user_id) {
            res.send({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try {
            await CartModel.remove({cart_id: {$in: products}});
            res.send({
                status: 1,
                success: '删除成功'
            })
        }catch(err) {
            res.send({
                status: 0,
                type: 'ERROR_DELETE',
                message: err.message,
            })
        }
    }

    async getMyCart(req, res, next) {
        const { user_id } = req.query;
        try{
            if(!user_id) {
                throw new Error('缺少用户参数');
            }
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: err.message,
            })
            return;
        }
        try{
            let product = await CartModel.find({user_id})
            product = await Promise.all(product.map(async function(item) {
                const result = await ProductModel.findOne({product_id: item.product_id});
                const user = await UserInfoModel.findOne({user_id: result.user_id}).select('userName');
                return {
                    price: result.price,
                    title: result.title,
                    product_id: item.product_id,
                    images: result.images[0],
                    owner: user.userName,
                    owner_id: result.user_id,
                    cart_id: item.cart_id,
                    isBuy: result.isBuy,
                }
            }))
            res.send(product)
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
            })
        }
    }

    async getAddState(req, res, next) {
        const { user_id, product_id } = req.params;
        const result = await CartModel.findOne({user_id, product_id});
        if(result) {
            res.send({
                status: 1,
                message: '已被添加'
            })
        } else {
            res.send({
                status: 0,
                message: '未被添加'
            })
        }
    }
}

export default new Cart();