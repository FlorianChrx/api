const ApiResponse = require('../model/response.model');

module.exports = app => {
    let router = require('express').Router();

    router.get('/:tag', async (request, response) => {
        response.send(new ApiResponse(true, "Message available in response data !", "Text"));//await textController.getText(Text, request.params.tag)));
    })

    app.use('/api/text', router)

}