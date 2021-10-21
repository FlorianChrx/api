const { Response } = require('../model/response.model');

module.exports = app => {
    let router = require('express').Router();
    const textController = require('../controllers/text.controller')

    router.get('/:tag', async (request, response) => {
        response.send(new Response(true, "Message available in response data !" ,await textController.getText(request.params.tag)));
    })

    app.use('/api/text', router)

}