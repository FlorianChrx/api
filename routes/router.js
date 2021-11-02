const { Response } = require('../model/response.model');

/**
 * Init all http routing
 */
exports.initRoutes = app => {
    require('./test.route')(app);
    require('./text.route')(app);
    require('./experience.route')(app);
    require('./training.route')(app);
    require('./trade.route')(app);
}

/**
 * Send the API response with right status
 * @param {Response} response the API response
 * @param {*} httpResponse the http response
 */
exports.send = function (response, httpResponse) {
    if (response.success) {
        httpResponse.send(response);
    } else {
        httpResponse.status(500).send(response);
    }
}