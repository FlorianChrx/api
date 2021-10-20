const Response = require('../model/response.model').Response

exports.test = async (request, response) => {
    response.send(new Response(true));
}