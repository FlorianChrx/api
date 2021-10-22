const { Experience } = require('../model/experience.model')

/**
 * Get all experiences
 * @returns Promise an array of experiences
 */
exports.getAll = async () => {
    return await Experience.findAll();
}

/**
 * Get the experience from database
 * @param {number} id the experience's id
 * @returns Promise the experience asked 
 */
exports.get = async (id) => {
    return await Experience.findOne({
        where: {
            id: id
        }
    })
}

/**
 * Save an experience in database
 * @param {Experience} experience to save
 * @returns Promise the saved experience
 */
exports.create = async (experience) => {
    return await Experience.create(experience);
}

/**
 * Delete an experience from database by its id
 * @param {number} id of the experience to delete
 * @returns the number of experiences deleted (anormal if > 1)
 */
exports.delete = async (id) => {
    return await Experience.destroy({
        where: {
            id: id
        }
    });
}

/**
 * Update an experience
 * @param {number} id of the experience to update
 * @param {Experience} experience modified to save
 * @returns the number of experiences updated (anormal if > 1)
 */
exports.edit = async (id, experience) => {
    delete experience.id;
    return await Experience.update(experience, {
        where: {
            id: id
        }
    })
}