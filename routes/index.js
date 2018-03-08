module.exports = app => {
    // app.get('/', function (req, res, next) {
    //     res.redirect('/')
    // })
    app.use('/user', require('./user'))
    app.use('/signup', require('./signup'))
}