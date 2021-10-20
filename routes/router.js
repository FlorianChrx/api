/**
 * Init all http routing
 */
exports.initRoutes = app => {
    require('./test.route')(app);
    require('./text.route')(app);
}