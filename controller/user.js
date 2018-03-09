import BaseComponent from '../prototype/baseComponent'
import formidable from 'formidable'
import UserModel from '../models/user'
import UserInfoModel from '../models/userInfo'
import dtime from 'time-formater'
import crypto from 'crypto'

class User extends BaseComponent {
    constructor() {
        super()
        this.encryption = this.encryption.bind(this)
        this.registered = this.registered.bind(this)
        this.login = this.login.bind(this)
    }
    async registered(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const { userName, password, confirmPassword } = fields;
            try {
                if (!userName) {
                    throw new Error('用户参数错误');
                } else if (!password) {
                    throw new Error('必须填写密码');
                } else if (!confirmPassword) {
                    throw new Error('必须填写确认密码');
                } else if (password !== confirmPassword) {
                    throw new Error('必须填写密码');
                }
            } catch (err) {
                console.log('注册用户失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err.message,
                })
                return
            }
            try {
                const user = await UserModel.findOne({userName})
                if (!user) {
                    const newPassword = this.encryption(password);
                    const user_id = await this.getId('user_id');
                    const registered_time = dtime().format('YYYY-MM-DD HH:mm');
                    const newUser = {userName, password: newPassword, user_id};
                    const newUserInfo = {userName, user_id, id: user_id, registered_time,};
                    UserModel.create(newUser);
                    const createUser = new UserInfoModel(newUserInfo);
                    const userInfo = await createUser.save();
                    res.send({
                        status: 1,
                        message: '注册成功'
                    })
                }else {
                    res.send({
                        status: 0,
                        error: 'ERROR_USERNAME',
                        message: '用户名已存在'
                    })
                }
            } catch (err) {
                console.log('用户注册失败',err);
                res.send({
                    status: 0,
                    type: 'REGISTERED_USER_FAILED',
                    message: '注册失败'
                })
            }
        })
    }

    async login(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const { userName, password, confirmPassword } = fields;
            try{
                if(!userName) {
                    throw new Error('用户名参数错误');
                }else if(!password) {
                    throw new Error('密码参数错误');
                }
            }catch(err) {
                console.log('登录参数错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err,
                })
                return
            }
            const newPassword = this.encryption(password);
            try{
                const user = await UserModel.findOne({ userName });
                if(!user) {
                    res.send({
                        status: 0,
                        error: 'ERROR_USERNAME',
                        message: '用户名不存在',
                    })
                }else if(user.password.toString() !== newPassword.toString()){
                    console.log('用户登录密码错误');
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码错误',
                    })
                }else {
                    req.session.user_id = user.user_id;
                    const userInfo = await UserInfoModel.findOne({user_id:user.user_id});
                    res.send(userInfo);
                }
            }catch(err) {
                console.log('用户登陆失败', err);
				res.send({
					status: 0,
					type: 'SAVE_USER_FAILED',
					message: '登陆失败',
				})
            }
        })
    }

    encryption(password){
		const newPassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newPassword;
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
}

export default new User()