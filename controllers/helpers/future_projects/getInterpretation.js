// --------------------------------------------
// FUTURE PROJECTS: INCORPORATE AUTOMATION USING OPENAI
// --------------------------------------------
// import OpenAI from "openai";
// const openai = new OpenAI();

// TODO: figure out how to get data from database and then pick it apart to do interpretations
// For birthcharts:
// Sun sign (larger token amount)
// Moon sign (larger token amount)
// Ascendant (larger token amount)
// Planet meaning in Constellations (10 to go over?)
// Planet in House position
// Aspect(Trine, Sextile, Square, Conjunction, Opposition) between Planet and Planet

// Extracted planets data from API
// const planetsData = [
//     //...retrieve planet data
// ];

// // Extracted aspects data from API
// const aspectsData = [
//     //...retrieve aspects data
// ];

// // Extracted house data from API
// const houseData = [
//     //...retrieve house data
// ]

// // Want major sign meanings here for sun, moon, ascendant
// async function getMajorSignMeanings(date) {
//     const response = await openai.chat.completions.create({
//         messages: [
//             { role: "system", content: "You are an astrology assistant." },
//             { role: "user", content: `Provide interpretation for ${planet} in house ${house}.` }
//         ],
//         model: "gpt-3.5-turbo",
//         max_tokens: 100
//     });
//     return response.choices[0].message.content;
// }

// // Planet meaning in Constellations (11) [planet + constellationName]
// async function getPlanetConstellation(planet, constellationName) {
//     const response = await openai.chat.completions.create({
//         messages: [
//             { role: "system", content: "You are an astrology assistant." },
//             { role: "user", content: `Provide interpretation for ${planet} in house ${constellationName}.` }
//         ],
//         model: "gpt-3.5-turbo",
//         max_tokens: 100 
//     })
// }

// // Planet meaning in Houses (11)
// async function getPlanetInterpretation(planet, house) {
//     const response = await openai.chat.completions.create({
//         messages: [
//             { role: "system", content: "You are an astrology assistant." },
//             { role: "user", content: `Provide interpretation for ${planet} in house ${house}.` }
//         ],
//         model: "gpt-3.5-turbo",
//         max_tokens: 100
//     });
//     return response.choices[0].message.content;
// }

// // Aspect(Trine, Sextile, Square, Conjunction, Opposition) between Planet and Planet
// async function getAspectInterpretation(planet1, planet2, aspect) {
//     const response = await openai.chat.completions.create({
//         messages: [
//             { role: "system", content: "You are an astrology assistant." },
//             { role: "user", content: `Provide interpretation for aspect ${aspect} between ${planet1} and ${planet2}.` }
//         ],
//         model: "gpt-3.5-turbo",
//         max_tokens: 100
//     });
//     return response.choices[0].message.content;
// }

// async function generateReport() {
//     let report = "";
//     // Interpretation for each planet in its house
//     for (const planetData of planetsData) {
//         const planet = planetData.entry.name;
//         const house = determineHouse(planetData);  // Implement a function that determines the house number based on altitude and house cusps
//         const interpretation = await getPlanetInterpretation(planet, house);
//         report += `${planet} in house ${house}: ${interpretation}\n\n`;
//     }
//     // Interpretation for aspects
//     for (const aspectData of aspectsData) {
//         const { planet1, planet2, aspect } = extractAspectDetails(aspectData);  // Implement a function that extracts planet names and the aspect from the aspectData
//         if (aspect) {
//             const interpretation = await getAspectInterpretation(planet1, planet2, aspect);
//             report += `Aspect between ${planet1} and ${planet2} - ${aspect}: ${interpretation}\n\n`;
//         }
//     }
//     return report;
// }
// generateReport().then(console.log);