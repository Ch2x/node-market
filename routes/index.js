import user from './user'
import product from './product'
import comment from './comment'
import cart from './cart'
import address from './address'
import management from './management'

export default app => {
    // app.get('/', function (req, res, next) {
    //     res.redirect('/')
    // })
    app.use('/user', user);
    app.use('/product', product);
    app.use('/comment', comment);
    app.use('/cart', cart);
    app.use('/address', address);
    app.use('/management', management);
}