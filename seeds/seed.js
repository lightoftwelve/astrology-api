const sequelize = require('../config/connection');
const { Member, AstrologyAspectData, CelestialBodyData, ZodiacSignData, AspectDescriptionData } = require('../models');

const memberData = require('./memberData.json');
const aspectData = require('./aspectData.json');
const celestialData = require('./celestialData.json');
const zodiacData = require('./zodiacSignData.json');
const getAspectDescription = require('./aspectDescriptionData.json');

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

    try {
        await AspectDescriptionData.bulkCreate(getAspectDescription, {
            individualHooks: true,
            returning: true,
        });
        console.log("successfully seeded aspect description data");
    } catch (error) {
        console.error("Error seeding aspect descriptions:", error);
    }



    process.exit(0);
};

seedDatabase();