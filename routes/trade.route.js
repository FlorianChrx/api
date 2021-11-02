const { Response } = require('../model/response.model');
const { Trade } = require('../model/trade.model')
const sender = require('./router')

module.exports = app => {
    let router = require('express').Router();
    const defaultController = require('../controllers/default.controller')
    const tradeController = require('../controllers/trade.controller')

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

    router.get('/buy/:symbol', async (request, response) => {
        tradeController.getBuyTrades(request.params.symbol)
            .then(data => {
                sender.send(new Response(true, "Trades availables in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/sell/:symbol', async (request, response) => {
        tradeController.getSellTrades(request.params.symbol)
            .then(data => {
                sender.send(new Response(true, "Trades availables in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/benefits/:symbol', async (request, response) => {
        tradeController.getBenefits(request.params.symbol)
            .then(data => {
                sender.send(new Response(true, "Benefits available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/average/:symbol', async (request, response) => {
        tradeController.getAveragePrice(request.params.symbol)
            .then(data => {
                sender.send(new Response(true, "Average price available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/all/benefits', async (request, response) => {
        tradeController.getAllBenefits()
            .then(data => {
                sender.send(new Response(true, "Benefits available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/all/symbols', async (request, response) => {
        tradeController.getSymbols()
            .then(data => {
                sender.send(new Response(true, "Symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/amount/:symbol', async (request, response) => {
        tradeController.getActualAmount(request.params.symbol)
            .then(data => {
                sender.send(new Response(true, "Symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/invested/:symbol', async (request, response) => {
        tradeController.getActualInvested(request.params.symbol)
            .then(data => {
                sender.send(new Response(true, "Symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/all/invested', async (request, response) => {
        tradeController.getAllActualInvested()
            .then(data => {
                sender.send(new Response(true, "Symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })


    router.get('/simulate/:symbol/:price/:amount', async (request, response) => {
        tradeController.simulateSell(request.params.symbol, request.params.price, request.params.amount)
            .then(data => {
                sender.send(new Response(true, "Benefits for this sell available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/all/simulate/:symbol/:price/', async (request, response) => {
        tradeController.simulateFullSell(request.params.symbol, request.params.price)
            .then(data => {
                sender.send(new Response(true, "Benefits for sell all of this symbol available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    app.use('/api/trade', router)

}