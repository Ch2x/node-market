import Ids from '../models/ids'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import gm from 'gm'

export default class BaseComponent {
    constructor() {
        this.idList = ['user_id', 'product_id', 'img_id', 'comment_id'];
    }

    async getId(type) {
        if(!this.idList.includes(type)) {
            console.log('id类型错误');
            throw new Error('id类型错误');
            return 
        }
        try{
            const idData = await Ids.findOne();
            idData[type] ++;
            await idData.save();
            return idData[type];
        }catch(err) {
            console.log('获取ID数据失败');
            throw new Error(err);
        }
    }

    async getPath(req) {
        return new Promise((resolve, reject) => {
            const form = formidable.IncomingForm();
            form.uploadDir = './public/img';
            form.parse(req, async (err, fileds, files) => {
                let img_id;
                try{
                    img_id = await this.getId('img_id');
                }catch(err) {
                    console.log("获取图片id失败");
                    fs.unlink(files.file.path);
                    reject('获取图片id失败');
                }
                const imgName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
				const fullName = imgName + path.extname(files.file.name);
				const repath = './public/img/' + fullName;
				try{
					await fs.rename(files.file.path, repath);
					gm(repath)
					.resize(200, 200, "!")
					.write(repath, async (err) => {
						// if(err){
						// 	console.log('裁切图片失败');
						// 	reject('裁切图片失败');
						// 	return
						// }
						resolve(fullName)
					})
				}catch(err){
					console.log('保存图片失败', err);
					fs.unlink(files.file.path)
					reject('保存图片失败')
				}
            })
        })
    }
}