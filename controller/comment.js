import BaseComponent from '../prototype/baseComponent'
import formidable from 'formidable'
import CommentModel from '../models/comment'
import UserInfoModel from '../models/userInfo'
import ProductModel from '../models/product'
import product from './product'
import dtime from 'time-formater'

class Comment extends BaseComponent {
    constructor() {
        super();
        this.postComment = this.postComment.bind(this);
    }

    async postComment(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if(err) {
                console.log('formidable解析出错', err);
                res.send({
                    status: 1,
                    message: '发布失败',
                });
                return;
            }
            const { product_id, content, from_uid, to_uid } = fields;
            try {
                if(!product_id || !content || !from_uid) {
                    throw new Error('评论参数错误');
                }
            } catch(err) {
                console.log('评论参数错误');
                res.send({
                    status: 0,
                    type: 'ERROR_POST',
                    message: err,
                })
                return;
            }
            try {
                const comment_id = await this.getId('comment_id');
                const commentTime = dtime().format('YYYY-MM-DD HH:mm');
                const newComment = { product_id, content, from_uid, to_uid, comment_id, commentTime };
                await CommentModel.create(newComment);
                res.send({
                    status: 1,
                    type: 'SUCCESS',
                    message: '评论成功',
                });
            } catch(err) {
                console.log('评论失败');
                res.send({
                    status: 0,
                    type: 'FAIL_COMMENT',
                    message: '评论失败',
                });
            }
        })
    }

    async getMyMessage(req, res, next) {
        // const user_id = req.session.user_id;
        const user_id = req.query.user_id
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
            let reply = await CommentModel.find({to_uid: user_id});
            reply = await Promise.all(reply.map(async function(item) {
                const userInfo = await UserInfoModel.findOne({user_id: item.from_uid}).select('avatar userName');
                const productInfo = await ProductModel.findOne({product_id: item.product_id}).select('images');
                if(productInfo === null) {
                    console.log(1);
                    return {
                        userName: userInfo.userName,
                        avatar: userInfo.avatar,
                        content: item.content,
                        product_id: item.product_id,
                        commentTime: item.commentTime,
                        isDelete: true,
                    }
                } else {
                    return {
                        userName: userInfo.userName,
                        avatar: userInfo.avatar,
                        content: item.content,
                        product_id: item.product_id,
                        commentTime: item.commentTime,
                        image: productInfo.images[0],
                    }
                }
            }))
            const productList = await ProductModel.find({user_id}).select('product_id');
            let comment = [];
            await Promise.all(productList.map(async function(item) {
                const result = await CommentModel.find({product_id: item.product_id}).sort({"commentTime": 1});
                if(result) {
                    comment.push(...result);
                }
            }))
            comment = await Promise.all(comment.map(async function(item) {
                if(item.to_uid == user_id || item.from_uid != user_id) {
                    const userInfo = await UserInfoModel.findOne({user_id: item.from_uid}).select('avatar userName');
                    const productInfo = await ProductModel.findOne({product_id: item.product_id}).select('images');
                    if(productInfo === null) {
                        console.log(1);
                        return {
                            userName: userInfo.userName,
                            avatar: userInfo.avatar,
                            content: item.content,
                            product_id: item.product_id,
                            commentTime: item.commentTime,
                            isDelete: true,
                        }
                    } else {
                        return {
                            userName: userInfo.userName,
                            avatar: userInfo.avatar,
                            content: item.content,
                            product_id: item.product_id,
                            commentTime: item.commentTime,
                            image: productInfo.images[0],
                        }
                    }
                }
            }))
            comment = comment.filter(function(item) {
                return item;
            })
            comment = [
                ...reply,
                ...comment,
            ]
            res.send(comment);
        }catch(err) {
            res.json({
                status: 0,
                type: 'FAIL_GET',
                message: err.message,
            })
        }
    }
}

export default new Comment();