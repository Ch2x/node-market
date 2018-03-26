import BaseComponent from '../prototype/baseComponent'
import formidable from 'formidable'
import CommentModel from '../models/comment'
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
                const newComment = { product_id, content, from_uid, to_uid, comment_id };
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
}

export default new Comment();