const sequelize = require('../config/connection');
const { Member, AstrologyAspectData, CelestialBodyData, ZodiacSignData, AspectDescriptionData } = require('../models');

const memberData = require('./memberData.json');
const aspectData = require('./aspectData.json');
const celestialData = require('./celestialData.json');
const zodiacData = require('./zodiacSignData.json');
const aspectDescriptionData = require('./aspectDescriptionData.json');
const getAspectDescription = require('../controllers/helpers/getAspectDescription');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
    console.log("Synced successfully.");

    console.log("Seeding members...");
    await Member.bulkCreate(memberData, {
        individualHooks: true,
        returning: true,
    });
    console.log("Seeded members successfully.");

    console.log("Seeding astrology aspects...")
    await AstrologyAspectData.bulkCreate(aspectData, {
        individualHooks: true,
        returning: true,
    });
    console.log("successfully seeded aspects");

    console.log("seeding celestial data...")
    await CelestialBodyData.bulkCreate(celestialData, {
        individualHooks: true,
        returning: true,
    });
    console.log("successfully seeded celestial data")

    console.log("seeding zodiac data...")
    await ZodiacSignData.bulkCreate(zodiacData, {
        individualHooks: true,
        returning: true,
    });
    console.log("successfully seeded zodiac data")

    console.log("seeding aspect descriptions...")
    await AspectDescriptionData.bulkCreate(getAspectDescription, {
        individualHooks: true,
        returning: true,
    });
    console.log("successfully seeded aspect description data")

    process.exit(0);
};

seedDatabase();