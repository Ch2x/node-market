import user from './user'
import product from './product'
import comment from './comment'

export default app => {
    // app.get('/', function (req, res, next) {
    //     res.redirect('/')
    // })
    app.use('/user', user);
    app.use('/product', product);
    app.use('/comment', comment);
}