const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_GPT_KEY,
  baseURL: "https://api.pawan.krd/v1",
  dangerouslyAllowBrowser: true,
});

// API Endpoint
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "pai-001",
      messages: [
        {
          role: "system",
          content:
            " just provide code , give code in proper format that can be display within a div tag with proprer formatting dont use any comments dont give html code use new line and tab spaces and indentation to properly format code dont give comments and dont give explaination,give multiline response",
        },
        { role: "user", content: prompt },
      ],
    });

    res.json({
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
