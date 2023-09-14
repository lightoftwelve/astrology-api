const { Op } = require('sequelize');
const AspectDescriptionData = require('../../models/AspectDescriptionData');

async function getAspectDescription(aspect) {
    const descriptionRecord = await AspectDescriptionData.findOne({
        where: {
            aspect: aspect.aspect,
            [Op.or]: [
                { body_id_1: aspect.body_id_1, body_id_2: aspect.body_id_2 },
                { body_id_1: aspect.body_id_2, body_id_2: aspect.body_id_1 }
            ]
        }
    });
    console.log("Querying with aspect:", aspect.aspect, "and bodies:", aspect.body_id_1, aspect.body_id_2);

    return descriptionRecord ? descriptionRecord.description : null;
}

module.exports = { getAspectDescription };