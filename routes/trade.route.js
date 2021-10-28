const { Response } = require('../model/response.model');
const { Trade } = require('../model/trade.model')
const sender = require('./router')

module.exports = app => {
    let router = require('express').Router();
    const defaultController = require('../controllers/default.controller')

    router.get('/', async (request, response) => {
        defaultController.getAll(Trade)
            .then(data => {
                sender.send(new Response(true, "Trades available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/:id', async (request, response) => {
        defaultController.get(Trade, request.params.id)
            .then(data => {
                sender.send(new Response(true, "Trade available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.put('/', async (request, response) => {
        defaultController.create(Trade, request.body)
            .then(data => {
                sender.send(new Response(true, "Trade created !", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        defaultController.edit(Trade, request.body.id, request.body)
            .then(data => {
                sender.send(new Response(true, "Trade updated ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        defaultController.delete(Trade, request.params.id)
            .then(data => {
                sender.send(new Response(true, "Trade deleted ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    app.use('/api/trade', router)

}