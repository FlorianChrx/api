const { Response } = require('../model/response.model');
const sender = require('./router')

module.exports = app => {
    let router = require('express').Router();
    const trainingController = require('../controllers/training.controller')

    router.get('/', async (request, response) => {
        trainingController.getAll()
            .then(data => {
                sender.send(new Response(true, "Trainings available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
        sender.send(res, response)
    })

    router.get('/:id', async (request, response) => {
        trainingController.get(request.params.id)
            .then(data => {
                sender.send(new Response(true, "Training available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
        sender.send(res, response)
    })

    router.put('/', async (request, response) => {
        trainingController.create(request.body)
            .then(data => {
                sender.send(new Response(true, "Training created !", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        trainingController.edit(request.body.id, request.body)
            .then(data => {
                sender.send(new Response(true, "Training updated ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        trainingController.delete(request.params.id)
            .then(data => {
                sender.send(new Response(true, "Training deleted ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    app.use('/api/training', router)

}