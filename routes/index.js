import user from './user'

export default app => {
    // app.get('/', function (req, res, next) {
    //     res.redirect('/')
    // })
    app.use('/user', user);
}