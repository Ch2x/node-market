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

    async delShop(req, res, next) {
    
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