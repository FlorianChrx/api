const {DefaultController} = require("./default.controller");
const {Training} = require("../model/training.model");

module.exports = class TrainingController extends DefaultController {
    constructor() {
        super(Training);
    }
}