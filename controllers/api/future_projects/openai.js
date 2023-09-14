// --------------------------------------------
// FUTURE PROJECTS: INCORPORATE AUTOMATION USING OPENAI
// --------------------------------------------
// require('dotenv').config();
// const { OpenAIApi } = require('openai');
// const elementConfig = require('../../config/elementConfig'); // Import the configuration
// const openai = require('openai');

// if (!process.env.API_KEY) {
//     throw new Error('API_KEY environment variable is not defined');
// }

// const openaiInstance = new openai.OpenAI({
//     organization: process.env.ORGANIZATION_KEY,
//     apiKey: process.env.API_KEY,
// });

// async function generateChatCompletion(messages, maxTokens) {
//     try {
//         const response = await openaiInstance.Chat.Completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: messages,
//             max_tokens: maxTokens,
//         });

//         if (!Array.isArray(response.choices) || response.choices.length === 0) {
//             throw new Error('Received an invalid response from OpenAI API');
//         }

//         return response.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error in openaiService:', error);
//         return `Error: Failed to generate response for ${messages[1].content}`;
//     }
// }

// module.exports = { generateChatCompletion };