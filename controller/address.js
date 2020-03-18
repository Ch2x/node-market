import AddressModel from '../models/address'
import formidable from 'formidable'
import BaseComponent from '../prototype/baseComponent'

class Address extends BaseComponent {
    constructor() {
        super();
        this.postAddress = this.postAddress.bind(this);

    }

    async postAddress(req, res, next) {
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
            const { address, phone, user_id, name, postCode, } = fields;
            try {
                if (!address) {
                    throw new Error('地址参数错误');
                } else if (!phone) {
                    throw new Error('地址参数错误');
                } else if (!name) {
                    throw new Error('地址参数错误');
                } else if (!postCode) {
                    throw new Error('地址参数错误');
                }
            } catch (err) {
                console.log('增加地址参数错误');
                res.send({
                    status: 0,
                    type: 'ERROR_POST',
                    message: err,
                })
                return;
            }
            try {
                const address_id = await this.getId('address_id');
                const newAddress = { address, phone, user_id, name, postCode, address_id };
                await AddressModel.create(newAddress);
                res.send({
                    status: 1,
                    type: 'SUCCESS',
                    message: '地址添加成功',
                })
            }catch (err) {
                console.log('添加失败', err);
                res.send({
                    status: 0,
                    type: 'FAIL_ADD',
                    message: err.message,
                })
                return;
            };

        })   
    }

    async getMyAddress(req, res, next) {
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
            const addresses = await AddressModel.find({user_id});
            res.send(addresses);
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
            })
        }
    }

    async delAddress(req, res, next) {
        const { user_id, address_id } = req.params;
        if(!user_id || !address_id) {
            res.send({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try {
            await AddressModel.remove({address_id});
            res.send({
                status: 1,
                success: '删除成功',
            });
        }catch(err) {
            res.send({
                status: 0,
                ttype: 'ERROR_DELETE',
                message: err.message,
            })
        }
    }
}

export default new Address();