import BaseComponent from '../prototype/baseComponent'
import formidable from 'formidable'
import ProductModel from '../models/product'
import UserInfoModel from '../models/userInfo'
import dtime from 'time-formater'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

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
        const user_id = req.session.user_id;
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
            const products = await ProductModel.find({user_id});
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
        const { sort } = req.query;
        console.log(sort);
        try{
            var filter = {};
            if(sort) {
                filter = { sort };
            }
            const products = await ProductModel.find(filter);
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
            const user_id = product.user_id;
            const userInfo = await UserInfoModel.findOne({user_id});
            res.send({
                product,
                userInfo,
            });
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: '获取失败',
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
            const result = await ProductModel.find({ title: searchValue });
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
}

export default new Product();