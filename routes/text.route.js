const { Response } = require('../model/response.model');
const { Text } = require('../model/text.model')

module.exports = app => {
    let router = require('express').Router();
    const defaultController = require('../controllers/default.controller')

    router.get('/:tag', async (request, response) => {
        response.send(new Response(true, "Message available in response data !", await textController.getText(Text, request.params.tag)));
    })

    app.use('/api/text', router)

}