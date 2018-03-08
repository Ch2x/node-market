module.exports = {
    port: 3000,
    session: {
        secret: 'Market',
        name: 'Market',
        maxAge: 365 * 24 * 60 * 60 * 1000,
    },
    mongodb: 'mongodb://localhost:27017/Mart'
}