import BaseComponent from '../prototype/baseComponent'
import formidable from 'formidable'
import ProductModel from '../models/product'
import UserInfoModel from '../models/userInfo'
import CommentModel from '../models/comment'
import dtime from 'time-formater'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import AddressModel from '../models/address';

class Product extends BaseComponent {
    constructor() {
        super();
        this.publicProduct = this.publicProduct.bind(this);
    }

    async publicProduct(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('formidable解析出错', err);
                res.send({
                    status: 1,
                    message: '发布失败',
                });
                return;
            }
            const { user_id, images, sort, description, title, price, } = fields;
            try {
                if (!sort) {
                    throw new Error('产品分类参数错误');
                } else if (!description) {
                    throw new Error('产品描述参数错误');
                } else if (!title) {
                    throw new Error('产品标题参数错误');
                } else if (!price) {
                    throw new Error('产品价格参数错误');
                }
            } catch (err) {
                console.log('发布产品参数错误');
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err,
                })
                return;
            }
            try {
                const product_id = await this.getId('product_id');
                const releaseTime = dtime().format('YYYY-MM-DD HH:mm');
                const newProduct = { product_id, user_id, images, releaseTime, sort, description, title, price, };
                await ProductModel.create(newProduct);
                res.send({
                    status: 1,
                    type: 'SUCCESS',
                    message: '发布商品成功',
                })
            } catch (err) {
                console.log('发布失败', err);
                res.send({
                    status: 0,
                    type: 'FAIL_RELEASE',
                    message: '发布失败',
                })
                return;
            };

        })
    }

    async getProducts(req, res, next) {
        const user_id = req.query.user_id;
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
            const products = await ProductModel.find({user_id, isBuy: false}).sort({'_id': -1});
            res.send(products);
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
            })
        }
    }

    async getAllProducts(req, res, next) {
        const { sort, page, pageSize, sorting } = req.query;
        let flag ={releaseTime: -1};
        if(sorting == 1) {
             flag = {price: 1};
        }else if(sorting == 2) {
            flag = {price: -1};
        }else if(sorting == 3) {
            flag = {releaseTime: -1};
        }
        const size =parseInt(pageSize);
        const skip = (page - 1) * size;
        try{
            var filter = { isBuy: false, isCheck: true, };
            if(sort) {
                console.log(sort);
                filter = { 
                    sort,
                    isBuy: false, 
                    isCheck: true,
                };
            }
            const products = await ProductModel.find(filter).skip(skip).limit(size).sort(flag);
            res.send(products);
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
            })
        }
    }

    async getDetail(req, res, next) {
        const { product_id } = req.query;
        try{
            if(!product_id) {
                throw new Error('缺少商品参数');
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
            const product = await ProductModel.findOne({product_id});
            let comment = await CommentModel.find({product_id});
            comment = await Promise.all(comment.map(async function(item){
                    const from_name = await UserInfoModel.findOne({user_id: item.from_uid}).select('userName');
                    const to_name = await UserInfoModel.findOne({user_id: item.to_uid}).select('userName');
                    return { 
                        content: item.content,
                        from_uid: item.from_uid,
                        from_name: from_name.userName,
                        to_uid: item.to_uid,
                        to_name: to_name?to_name.userName:undefined,
                    };
                })
            );
            const user_id = product.user_id;
            const userInfo = await UserInfoModel.findOne({user_id});
            res.send({
                product,
                userInfo,
                comment,
            });
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: err,
            })
        }
    }

    async searchProduct(req, res, next) {
        let { searchValue } = req.query;
        try{
            if(!searchValue) {
                throw new Error('缺少搜索参数');
            }
        }catch(err) {
            res.json({
                status: 0,
                type: 'ERROR',
                message: res.message,
            })
        }
        try{
            searchValue = new RegExp(searchValue);

            const result = await ProductModel.find({ $or: [
                {title: {$regex: searchValue, $options: '$i'}},
                {description: {$regex: searchValue, $options: '$i'}}, 
              ], isBuy: false });
            res.send(result);
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
            });
        }
    }

    async delProduct(req, res, next) {
        const { user_id, product_id } = req.params;
        console.log(req.params);
        if(!user_id || !product_id) {
            res.send({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try {
            await ProductModel.findOneAndRemove({product_id});
            res.send({
                status: 1,
                success: '删除产品成功',
            });
        }catch(err) {
            res.send({
                status: 0,
                type: 'ERROR_DELETE',
                message: err.message,
            })
        }
    }

    async updateProduct(req, res, next) {
        const { product_id } = req.params;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if (err) {
                console.log('formidable解析出错', err);
                res.send({
                    status: 1,
                    message: '更改失败',
                });
                return;
            }
            const { images, sort, description, title, price, } = fields;
            try {
                if (!sort) {
                    throw new Error('产品分类参数错误');
                } else if (!description) {
                    throw new Error('产品描述参数错误');
                } else if (!title) {
                    throw new Error('产品标题参数错误');
                } else if (!price) {
                    throw new Error('产品价格参数错误');
                }
            } catch (err) {
                console.log('发布产品参数错误');
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err,
                })
                return;
            }
            try {
                await ProductModel.findOneAndUpdate({product_id}, {images, sort, description, title, price});
                res.send({
                    status: 1,
                    message: 'OK',
                })
            }catch(err) {
                res.send({
                    status: 0,
                    type: "ERROR_UPDATE",
                    message: err.message,
                })
            }
        })
    }

    async getOrderInfo(req, res, next) {
        const { user_id, product_id } = req.query;
        if(!user_id || !product_id) {
            res.send({
                type: 'ERROR_QUERY',
                message: '参数错误',
            })
            return
        }
        try {
            const address = await AddressModel.findOne({user_id});
            const product = await ProductModel.findOne({product_id});
            res.send({
                address,
                product,
            })
        }catch(err) {
            res.send({
                status: 0,
                ttype: 'ERROR_GET',
                message: err.message,
            })
        }
    }
}

export default new Product();