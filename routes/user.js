const express = require('express')
const router = express.Router()
const formidable = require('formidable')

const UserModel = require('./../models/user')

router.post('/registered', function(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const { userName, password, confirmPassword } = fields;
        try{
            if(!userName) {
                throw new Error('用户参数错误');
            }else if(!password) {
                throw new Error('必须填写密码');
            }else if(!confirmPassword) {
                throw new Error('必须填写确认密码');
            }else if(password !== confirmPassword) {
                throw new Error('必须填写密码');
            }
        }catch(err) {
            console.log('注册用户失败', err);
            res.send({
                status: 0,
                type: 'ERROR_QUERY',
                message: err.message,
            })
            return
        }
        try{
            const user = UserModel.findOne({userName});
            if(!user) {
                const user_id = 
            }
        }
    })
})

module.exports = router;