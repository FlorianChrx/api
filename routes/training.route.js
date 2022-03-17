const {ApiResponse} = require('../model/response.model');
const sender = require('./router')
const TrainingController = require("../controllers/training.controller");

module.exports = app => {
    let router = require('express').Router();
    const trainingController = new TrainingController();

    router.get('/', async (request, response) => {
        trainingController.getAll()
            .then(data => {
                sender.send(new ApiResponse(true, "Trainings available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.get('/:id', async (request, response) => {
        trainingController.get(request.params.id)
            .then(data => {
                sender.send(new ApiResponse(true, "Training available in response data", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.put('/', async (request, response) => {
        trainingController.create(request.body)
            .then(data => {
                sender.send(new ApiResponse(true, "Training created !", data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.post('/', async (request, response) => {
        trainingController.edit(request.body.id, request.body)
            .then(data => {
                sender.send(new ApiResponse(data === 1, `${data} trainings deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    router.delete('/:id', async (request, response) => {
        trainingController.delete(request.params.id)
            .then(data => {
                sender.send(new ApiResponse(data === 1, `${data} trainings deleted (count in data)`, data), response);
            })
            .catch(error => {
                sender.send(new ApiResponse(false, error.message), response);
            })
    })

    app.use('/api/training', router)

}