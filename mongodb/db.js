const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);
const chalk = require('chalk');

mongoose.connect(config.mongodb);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
    console.log(
        chalk.green('连接数据库成功')
    );
});

db.on('error', (error) => {
    console.error(
        chalk.red('Error in MongoDb connection: ' + error)
    );
});

db.on('close', () => {
    console.log(
        chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(config.mongodb, {server:{auto_reconnect:true}});
})