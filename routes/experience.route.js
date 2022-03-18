const ApiResponse = require('../model/response.model');
const sender = require('./router')
const ExperienceController = require("../controllers/experience.controller");

module.exports = app => {
    let router = require('express').Router();
    const experienceController = new ExperienceController();

    router.get('/', async (request, response) => {
        experienceController.getAll()
            .then(data => {
                sender.send(new ApiResponse(true, "Experiences available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/:id', async (request, response) => {
        experienceController.get(request.params.id)
            .then(data => {
                sender.send(new ApiResponse(true, "Experience available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.put('/', async (request, response) => {
        experienceController.create(request.body)
            .then(data => {
                sender.send(new ApiResponse(true, "Experience created !", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        experienceController.edit(request.body.id, request.body)
            .then(data => {
                sender.send(new ApiResponse(data === 1, `${data} experiences deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        experienceController.delete(request.params.id)
            .then(data => {
                sender.send(new ApiResponse(data === 1, `${data} experiences deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    app.use('/api/experience', router)

}