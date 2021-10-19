const Response = require('../model/response').Response

exports.test = async (request, response) => {
    response.send(new Response(true));
}