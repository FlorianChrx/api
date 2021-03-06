/**
 * Init all http routing
 */
exports.initRoutes = app => {
    require('./text.route')(app);
    require('./trade.route')(app);
}

/**
 * Send the API response with right status
 * @param {ApiResponse} response the API response
 * @param {*} httpResponse the http response
 */
exports.send = function (response, httpResponse) {
    if(!response.data) {
        response.isSuccess = false;
        response.data = "Fatal error !";
    }
    if (response.isSuccess) {
        httpResponse.send(response);
    } else {
        httpResponse.status(500).send(response);
    }
}