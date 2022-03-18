exports.DefaultController = class DefaultController {
    model;


    /**
     * Construct a generic default controller
     * @param model the model sequelize to use
     */
    constructor(model) {
        this.model = model
    }


    /**
     * Get all elements of a model type
     * @returns Promise an array of elements
     */
    async getAll() {
        return await this.model.findAll();
    }

    /**
     * Get the element from database by id
     * @param {number} id the elements id
     * @returns Promise the element asked
     */
    async get(id) {
        return await this.model.findOne({
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
    async create(element) {
        return this.model.create(element);
    }

    /**
     * Delete an element from database by its id
     * @param {number} id of the element to delete
     * @returns the number of elements deleted (wierd if > 1)
     */
    async delete(id) {
        return await this.model.destroy({
            where: {
                id: id
            }
        });
    }

    /**
     * Update an element
     * @param {number} id of the element to update
     * @param {*} element modified to save
     * @returns the number of elements updated (wierd if > 1)
     */
    async edit(id, element) {
        delete element.id;
        return await this.model.update(element, {
            where: {
                id: id
            }
        })
    }
}