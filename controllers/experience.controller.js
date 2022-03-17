const {DefaultController} = require("./default.controller");
const {Experience} = require("../model/experience.model");

module.exports = class ExperienceController extends DefaultController {
    constructor() {
        super(Experience);
    }
}