import path from 'path'
import express from 'express'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import flash from 'connect-flash'
// import configFile from 'config-lite'
import router from './routes/index'
import pkg from './package'
import db from './mongodb/db.js'
import expressWs from 'express-ws'
import fs from 'fs';



// const config = configFile(__dirname)
const config = require('./config/default.js')
const app = express()

// websocket
expressWs(app);

// 设置模板目录
// app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
// app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static('./public'));
app.use(express.static('./dist'));

// 第 2 步：获得一个createBundleRenderer
// const {
//   createBundleRenderer
// } = require("vue-server-renderer");
// const bundle = require("./dist/vue-ssr-server-bundle.json");
// const clientManifest = require("./dist/vue-ssr-client-manifest.json");

// const renderer = createBundleRenderer(bundle, {
//   runInNewContext: false,
//   template: fs.readFileSync(path.join(__dirname, "./public/index.template.html"), "utf-8"),
//   clientManifest,
// });

// function renderToString(context) {
//   return new Promise((resolve, reject) => {
//     renderer.renderToString(context, (err, html) => {
//       err ? reject(err) : resolve(html);
//     });
//   });
// }


app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", '3.2.1')
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));


// session 中间件
const MongoStore = connectMongo(session)
app.use(session({
  name: config.session.name, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({ // 将 session 存储到 mongodb
    url: config.mongodb // mongodb 地址
  })
}))
// flash 中间件，用来显示通知
app.use(flash())

// 路由
router(app)

// app.get('*', async(req, res) => {
//   const context = {
//     title: "ssr test",
//     url: req.url
//   };
//   console.log(context)
//   // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
//   // 现在我们的服务器与应用程序已经解耦！
//   const html = await renderToString(context);
//   res.end(html)
// })

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})