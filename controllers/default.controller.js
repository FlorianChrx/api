/**
 * Get all elements of a model type
 * @returns Promise an array of elements
 */
exports.getAll = async (model) => {
    return await model.findAll();
}

/**
 * Get the element from database by id
 * @param {number} id the elements id
 * @returns Promise the element asked 
 */
exports.get = async (model, id) => {
    return await model.findOne({
        where: {
            id: id
        }
    })
}

/**
 * Save an element in database
 * @param {*} experience to save
 * @returns Promise the saved experience
 */
exports.create = async (model, experience) => {
    return await model.create(experience);
}

/**
 * Delete an element from database by its id
 * @param {number} id of the element to delete
 * @returns the number of elements deleted (anormal if > 1)
 */
exports.delete = async (model, id) => {
    return await model.destroy({
        where: {
            id: id
        }
    });
}

/**
 * Update an experience
 * @param {number} id of the experience to update
 * @param {Experience} experience modified to save
 * @returns the number of elements updated (anormal if > 1)
 */
exports.edit = async (model, id, experience) => {
    delete experience.id;
    return await model.update(experience, {
        where: {
            id: id
        }
    })
}