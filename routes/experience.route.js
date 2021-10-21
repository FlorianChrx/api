const { Response } = require('../model/response.model');
const sender = require('./router')

module.exports = app => {
    let router = require('express').Router();
    const experienceController = require('../controllers/experience.controller')

    router.get('/', async (request, response) => {
        experienceController.getAll()
            .then(data => {
                sender.send(new Response(true, "Experiences available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
        sender.send(res, response)
    })

    router.get('/:id', async (request, response) => {
        experienceController.get(request.params.id)
            .then(data => {
                sender.send(new Response(true, "Experience available in response data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
        sender.send(res, response)
    })

    router.put('/', async (request, response) => {
        experienceController.create(request.body)
            .then(data => {
                sender.send(new Response(true, "Experience created !", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        experienceController.edit(request.body.id, request.body)
            .then(data => {
                sender.send(new Response(true, "Experience updated ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        experienceController.delete(request.params.id)
            .then(data => {
                sender.send(new Response(true, "Experience deleted ! count in data", data), response);
            })
            .catch(error => {
                sender.send(new Response(false, error.message), response);
            })
    })

    app.use('/api/experience', router)

}