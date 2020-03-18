import BaseComponent from '../prototype/baseComponent'
import SortModel from '../models/Sort'
import formidable from 'formidable'

class Sort extends BaseComponent {
    constructor() {
        super();
        this.addSort = this.addSort.bind(this);
    }

    async addSort(req, res, next) {
        const { sortName } = req.query;
        if(!sortName) {
            console.log('添加失败', err);
                res.send({
                    status: 1,
                    message: '添加失败',
                });
            return;
        }
        try {
            const sort_id = await this.getId('sort_id');
            const newSort = { sort_id, sortName };
            await SortModel.create(newSort);
            res.send({
                status: 1,
                type: 'SUCCESS',
                message: '添加成功',
            })
        }catch (err) {
            console.log('添加', err);
            res.send({
                status: 0,
                type: 'FAIL_ADD',
                message: '添加失败',
            })
            return;
        };
    }

    async getSortCount(req, res, next) {
        try {
            const count = await SortModel.find().count();
            res.send({
                status: 1,
                total: count,
            });
        }catch(err) {
            res.send({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async getAllSorts(req, res, next) {
        const { page, pageSize } = req.query;
        const p = parseInt(page) || 1;
        const size = parseInt(pageSize) || 10;
        const skip = (p - 1) * size;
        try {
            const list = await SortModel.find().skip(skip).limit(size);
            res.send(
                list
            );
        }catch(err) {
            res.send({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async getSorts(req, res, next) {
        try {
            const list = await SortModel.find();
            res.send(list);
        }catch(err) {
            res.send({
                status: 0,
                type: 'ERROR_GET',
                message: err.message,
            })
        }
    }

    async editSort(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if (err) {
                console.log('formidable解析出错', err);
                res.send({
                    status: 1,
                    message: '修改失败',
                });
                return;
            }
            const { sort_id, sortName } = fields;
            try {
                if (!sort_id) {
                    throw new Error('分类ID参数错误');
                } else if (!sortName) {
                    throw new Error('分类名称描述参数错误');
                }
            } catch (err) {
                console.log('分类参数错误');
                res.send({
                    status: 0,
                    type: 'ERROR_EDIT',
                    message: err.message,
                })
                return;
            }
            try {
                await SortModel.findOneAndUpdate({sort_id}, {sortName});
                res.send({
                    status: 1,
                    message: 'OK',
                })
            }catch(err) {
                res.send({
                    status: 0,
                    type: "ERROR_EDIT",
                    message: err.message,
                })
            }
        })
    }
}

export default new Sort();