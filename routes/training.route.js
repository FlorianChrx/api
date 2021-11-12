const { Response } = require('../model/response.model');
const { Training } = require('../model/training.model')
const sender = require('./router')

module.exports = app => {
    let router = require('express').Router();
    const defaultController = require('../controllers/default.controller')

    router.get('/', async (request, response) => {
        defaultController.getAll(Training)
            .then(data => {
                sender.send(new Response(true, "Trainings available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.get('/:id', async (request, response) => {
        defaultController.get(Training, request.params.id)
            .then(data => {
                sender.send(new Response(true, "Training available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.put('/', async (request, response) => {
        defaultController.create(Training, request.body)
            .then(data => {
                sender.send(new Response(true, "Training created !", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        defaultController.edit(Training, request.body.id, request.body)
            .then(data => {
                sender.send(new Response(data == 1, `${data} trainings deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        defaultController.delete(Training, request.params.id)
            .then(data => {
                sender.send(new Response(data == 1, `${data} trainings deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    app.use('/api/training', router)

}