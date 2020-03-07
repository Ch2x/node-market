import AddressModel from '../models/address'
import BuyModel from '../models/buy'
import UserInfoModel from '../models/userInfo'
import formidable from 'formidable'
import BaseComponent from '../prototype/baseComponent'
import ProductModel from '../models/product'
import CartModel from '../models/cart'
import dtime from 'time-formater'
import UserInfo from '../models/userInfo';

class Buy extends BaseComponent {
    constructor() {
        super();
        this.confirmOrder = this.confirmOrder.bind(this);
    }

    async confirmOrder(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if (err) {
                console.log('formidable解析出错', err);
                res.sendStatus({
                    status: 1,
                    message: '更改失败',
                });
                return;
            }
            const { user_id, address_id, product_id, } = fields;
            try {
                if (!user_id) {
                    throw new Error('用户id参数错误');
                } else if (!address_id) {
                    throw new Error('地址id参数错误');
                } else if (!product_id) {
                    throw new Error('产品id参数错误');
                }
            } catch (err) {
                console.log('提交订单参数错误');
                res.sendStatus({
                    status: 0,
                    type: 'ERROR_POST',
                    message: err,
                })
                return;
            }
            try {
                await ProductModel.findOneAndUpdate({product_id},{isBuy: true});
                const buyTime = dtime().format('YYYY-MM-DD HH:mm');
                const buy_id = await this.getId('buy_id');
                const newBuy = { user_id, address_id, product_id, buyTime, buy_id };
                await BuyModel.create(newBuy);
                await CartModel.remove({user_id, product_id});
                const productInfo = await ProductModel.findOne({product_id}).select('user_id');
                const userInfo = await UserInfoModel.findOne({user_id: productInfo.user_id}).select('userName');
                res.sendStatus({
                    status: 1,
                    type: 'SUCCESS',
                    message: {
                        buyTime,
                        buy_id,
                        userName: userInfo.userName,
                    },
                })
            }catch (err) {
                console.log('提交失败', err);
                res.sendStatus({
                    status: 0,
                    type: 'FAIL_RELEASE',
                    message: '提交失败',
                })
                return;
            };
        })
    }

    async getMyBuy(req, res, next) {
        const { user_id } = req.query;
        if(!user_id) {
            res.sendStatus({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try{
            const goods = await BuyModel.find({user_id}, {product_id: 1,_id: 0})
            let arr = [];
            for(var i = 0;i<goods.length;i++) {
                arr.push(goods[i].product_id)
            }
            const products = await ProductModel.find({product_id: {$in: arr}}).sort({'_id': -1});
            res.sendStatus(products);
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
            })
        }
    }

    async getMySold(req, res, next) {
        const { user_id } = req.query;
        if(!user_id) {
            res.sendStatus({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try{
            const products = await ProductModel.find({user_id, isBuy: true}).sort({'_id': -1});
            res.sendStatus(products);
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
            })
        }
    }

    async getBuyOrderDetail(req, res, next) {
        const { product_id, user_id } = req.query;
        if(!product_id || !user_id) {
            res.sendStatus({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try {
            const buy = await BuyModel.findOne({product_id});
            const product = await ProductModel.findOne({product_id});
            const address = await AddressModel.findOne({address_id: buy.address_id});
            const userInfo = await UserInfoModel.findOne({user_id: product.user_id});
            res.sendStatus({
                title: product.title,
                image: product.images[0],
                address: address.address,
                phone: address.phone,
                addressName: address.name,
                soldName: userInfo.userName,
                buyTime: buy.buyTime,
                buy_id: buy.buy_id,
                price: product.price,
            })
        }catch(err) {
            res.sendStatus({
                status: 0,
                type: 'ERROR_get',
                message: err.message,
            })
        }
    }
}

export default new Buy();