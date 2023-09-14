const fs = require('fs'); // Import the fs module

// Define an array of celestial bodies and aspects
const celestialBodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const aspects = ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition']; // Add more aspects as needed

// Create an array to store the generated JSON objects
const jsonData = [];

// Loop through each combination
for (const body1 of celestialBodies) {
    for (const body2 of celestialBodies) {
        if (body1 !== body2) { // Ensure the bodies are different
            for (const aspect of aspects) {
                const description = `Description for ${body1} ${aspect} ${body2}`;

                // Create a JSON object for the combination
                const combination = {
                    body_id_1: body1,
                    body_id_2: body2,
                    aspect: aspect,
                    description: description,
                };

                // Push the combination to the jsonData array
                jsonData.push(combination);
            }
        }
    }
}

// Convert the jsonData array to a JSON string
const jsonText = JSON.stringify(jsonData, null, 2);

// Write the JSON data to a text file
fs.writeFileSync('combinations.json', jsonText, 'utf8');