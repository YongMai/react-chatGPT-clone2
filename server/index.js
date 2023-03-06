require("dotenv").config();

const express = require("express");
const app = express();
const port = 4000;

// Middleware to check the origin of the request
app.use((req, res, next) => {
  const allowedOrigins = ['https://yongmai.xyz'];
  const origin = req.get('Origin');

  // If the origin is allowed, set the CORS headers
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
  }

  next();
});

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// adding body-parser and cors
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res) => {
  const { message } = req.body;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: message}],
    max_tokens: 3000,
    temperature: 0.5,
  });
  res.json({ botResponse: completion.data.choices[0].message.content});
  console.log(completion.data.choices[0].message);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
