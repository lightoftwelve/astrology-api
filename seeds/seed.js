const sequelize = require('../config/connection');
const { Member, AstrologyAspectData, CelestialBodyData } = require('../models');

const memberData = require('./memberData.json');
const aspectData = require('./aspectData.json');
const celestialData = require('./celestialData.json');

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

    process.exit(0);
};

seedDatabase();