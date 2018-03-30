import AddressModel from '../models/address'
import BuyModel from '../models/buy'
import formidable from 'formidable'
import BaseComponent from '../prototype/baseComponent'
import ProductModel from '../models/product'
import dtime from 'time-formater'

class Buy extends BaseComponent {
    constructor() {
        super();
        this.confirmOrder = this.confirmOrder.bind(this);
    }

    async confirmOrder(req, res, next) {
        const { user_id, address_id, product_id, } = req.body;
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
            res.send({
                status: 0,
                type: 'ERROR_POST',
                message: err,
            })
            return;
        }
        try {
            await ProductModel.findOneAndUpdate({product_id},{isBuy: false});
            const buyTime = dtime().format('YYYY-MM-DD HH:mm');
            const buy_id = await this.getId('buy_id');
            const newBuy = { user_id, address_id, product_id, buyTime, buy_id } ;
            await BuyModel.create(newBuy);
            res.send({
                status: 1,
                type: 'SUCCESS',
                message: '确定商品成功',
            })
        }catch (err) {
            console.log('提交失败', err);
            res.send({
                status: 0,
                type: 'FAIL_RELEASE',
                message: '提交失败',
            })
            return;
        };
    }
}

export default new Buy();