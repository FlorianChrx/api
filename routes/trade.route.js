const ApiResponse = require('../model/response.model');
const sender = require('./router')
const TradeController = require("../controllers/trade.controller");

module.exports = app => {
    let router = require('express').Router();
    const tradeController = new TradeController();

    router.get('/', async (request, response) => {
        tradeController.getAll()
            .then(data => {
                sender.send(new ApiResponse(true, "Trades available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/:id', async (request, response) => {
        tradeController.get(request.params.id)
            .then(data => {
                sender.send(new ApiResponse(true, "Trade available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.put('/', async (request, response) => {
        tradeController.create(request.body)
            .then(data => {
                if (data) {
                    sender.send(new ApiResponse(true, 'Trade created !', data), response);
                } else {
                    sender.send(new ApiResponse(false, 'Invalid Trade !'), response);
                }
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        tradeController.edit(request.body.id, request.body)
            .then(data => {
                sender.send(new ApiResponse(data === 1, `${data} trades deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        tradeController.delete(request.params.id)
            .then(data => {
                sender.send(new ApiResponse(data === 1, `${data} trades deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/buy/:symbol', async (request, response) => {
        tradeController.getBuyTrades(request.params.symbol)
            .then(data => {
                sender.send(new ApiResponse(true, "Trades available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/sell/:symbol', async (request, response) => {
        tradeController.getSellTrades(request.params.symbol)
            .then(data => {
                sender.send(new ApiResponse(true, "Trades available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/benefits/symbol/:symbol', async (request, response) => {
        tradeController.getBenefits(request.params.symbol)
            .then(data => {
                sender.send(new ApiResponse(true, "Benefits available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/average/symbol/:symbol', async (request, response) => {
        tradeController.getAveragePrice(request.params.symbol)
            .then(data => {
                sender.send(new ApiResponse(true, "Average price available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/benefits/all', async (request, response) => {
        tradeController.getAllBenefits()
            .then(data => {
                sender.send(new ApiResponse(true, "Benefits available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/symbols/all', async (request, response) => {
        tradeController.getSymbols()
            .then(data => {
                sender.send(new ApiResponse(true, "Symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/amount/symbol/:symbol', async (request, response) => {
        tradeController.getActualAmount(request.params.symbol)
            .then(data => {
                sender.send(new ApiResponse(true, "Actual amount for this symbol available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/amount/all', async (request, response) => {
        tradeController.getAllActualAmount(request.params.symbol)
            .then(data => {
                sender.send(new ApiResponse(true, "Actual amount for all symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/invested/symbol/:symbol', async (request, response) => {
        tradeController.getActualInvested(request.params.symbol)
            .then(data => {
                sender.send(new ApiResponse(true, "Symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/invested/all', async (request, response) => {
        tradeController.getAllActualInvested()
            .then(data => {
                sender.send(new ApiResponse(true, "Symbols available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })


    router.get('/simulate/sell/quantified/:symbol/:price/:amount', async (request, response) => {
        tradeController.simulateSell(request.params.symbol, request.params.price, request.params.amount)
            .then(data => {
                sender.send(new ApiResponse(true, "Gains for this sell available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/simulate/sell/all/:symbol/:price', async (request, response) => {
        tradeController.simulateFullSell(request.params.symbol, request.params.price)
            .then(data => {
                sender.send(new ApiResponse(true, "Gains for sell all of this symbol available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/simulate/benefits/quantified/:symbol/:price/:amount', async (request, response) => {
        tradeController.simulateBenefits(request.params.symbol, request.params.price, request.params.amount)
            .then(data => {
                sender.send(new ApiResponse(true, "Benefits after simulated sell trade for this symbol available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/simulate/benefits/all/:symbol/:price', async (request, response) => {
        tradeController.simulateAllBenefits(request.params.symbol, request.params.price)
            .then(data => {
                sender.send(new ApiResponse(true, "Benefits after simulated full sell trade for this symbol available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/simulate/sell/partial/:symbol/:price/:percentage', async (request, response) => {
        tradeController.simulatePartialSell(request.params.symbol, request.params.price, request.params['percentage'])
            .then(data => {
                sender.send(new ApiResponse(true, "Gains for partial sell available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/simulate/benefits/partial/:symbol/:price/:percentage', async (request, response) => {
        tradeController.simulatePartialBenefits(request.params.symbol, request.params.price, request.params['percentage'])
            .then(data => {
                sender.send(new ApiResponse(true, "Benefits after partial sell available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.post('/refresh/:symbol/:amount', async (request, response) => {
        tradeController.refreshAmount(request.params.symbol, request.params.amount)
            .then(() => {
                sender.send(new ApiResponse(true, "Amount refreshed !"), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    app.use('/api/trade', router)

}