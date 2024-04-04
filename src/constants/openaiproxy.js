const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: "pk-IoRFAJEXSWxVaPgXcPhaxGiQxVUWiZrmmXDMiGEOXSlRfJud", // For self-hosted version you can put anything
    baseURL: "https://api.pawan.krd/v1", // For self-hosted version, use "http://localhost:3040/v1"
});
async function getResp() {

    const chatCompletion = await openai.chat.completions.create({
         
        messages: [{ role: 'system', content: ' just provide code , give code in proper format that can be display within a div tag with proprer formatting dont use any comments dont give html code use new line and tab spaces and indentation to properly format code dont give comments and dont give explaination' }, { role: 'user', content: 'write code to create a start pattern in javascript ' }],
        model: 'pai-001',

    });
    console.log(chatCompletion.choices[0].message.content);
}
getResp() 