import user from './user'
import product from './product'

export default app => {
    // app.get('/', function (req, res, next) {
    //     res.redirect('/')
    // })
    app.use('/user', user);
    app.use('/product', product);
}