const { Training } = require('../model/training.model')

/**
 * Get all trainings
 * @returns Promise an array of trainings
 */
exports.getAll = async () => {
    return await Training.findAll();
}

/**
 * Get the training from database
 * @param {number} id the training's id
 * @returns Promise the training asked 
 */
exports.get = async (id) => {
    return await Training.findOne({
        where: {
            id: id
        }
    })
}

/**
 * Save an training in database
 * @param {Training} training to save
 * @returns Promise the saved training
 */
exports.create = async (training) => {
    return await Training.create(training);
}

/**
 * Delete an training from database by its id
 * @param {number} id of the training to delete
 * @returns the number of trainings deleted (anormal if > 1)
 */
exports.delete = async (id) => {
    return await Training.destroy({
        where: {
            id: id
        }
    });
}

/**
 * Update an training
 * @param {number} id of the training to update
 * @param {Training} training modified to save
 * @returns the number of trainings updated (anormal if > 1)
 */
exports.edit = async (id, training) => {
    delete training.id;
    return await Training.update(training, {
        where: {
            id: id
        }
    })
}