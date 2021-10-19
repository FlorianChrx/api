module.exports = app => {
    let router = require('express').Router();
    const testController = require('../controllers/test.controller')

    router.get('/', testController.test)

    app.use('/api/test', router)

}