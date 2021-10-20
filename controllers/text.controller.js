const { Text } = require('../model/text.model');

exports.getText = async (tag) => {
    return await Text.findOne({
        where: {
            tag: tag
        }
    })
}