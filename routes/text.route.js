module.exports = app => {
    let router = require('express').Router();
    const textController = require('../controllers/text.controller')

    router.get('/:tag', async (request, response) => {
        response.send(await textController.getText(request.params.tag))
    })

    app.use('/api/text', router)

}