const { Response } = require('../model/response.model');
const { Experience } = require('../model/experience.model')
const sender = require('./router')

module.exports = app => {
    let router = require('express').Router();
    const defaultController = require('../controllers/default.controller')

    router.get('/', async (request, response) => {
        defaultController.getAll(Experience)
            .then(data => {
                sender.send(new Response(true, "Experiences available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
        sender.send(res, response)
    })

    router.get('/:id', async (request, response) => {
        defaultController.get(Experience, request.params.id)
            .then(data => {
                sender.send(new Response(true, "Experience available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
        sender.send(res, response)
    })

    router.put('/', async (request, response) => {
        defaultController.create(Experience, request.body)
            .then(data => {
                sender.send(new Response(true, "Experience created !", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        defaultController.edit(Experience, request.body.id, request.body)
            .then(data => {
                sender.send(new Response(true, "Experience updated ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        defaultController.delete(Experience, request.params.id)
            .then(data => {
                sender.send(new Response(true, "Experience deleted ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    app.use('/api/experience', router)

}