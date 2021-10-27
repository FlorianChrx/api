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
 * @param {*} element to save
 * @returns Promise the saved element
 */
exports.create = async (model, element) => {
    return await model.create(element);
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
 * Update an element
 * @param {number} id of the element to update
 * @param {*} element modified to save
 * @returns the number of elements updated (anormal if > 1)
 */
exports.edit = async (model, id, element) => {
    delete element.id;
    return await model.update(element, {
        where: {
            id: id
        }
    })
}