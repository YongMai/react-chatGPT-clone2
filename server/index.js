require("dotenv").config();

const express = require("express");
const app = express();
const port = 4000;


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

function approximateTokenCount(text) {
  // Approximate token count based on number of characters
  return text.trim().length;
}

app.post("/", async (req, res) => {
  // Check if the request origin is allowed
  const allowedOrigins = ['https://gptturbo.yongmai.xyz', 'https://yongmai.netlify.app','https://chat.yongmai.xyz','https://*.yongmai.xyz','https://yongmai.xyz'];
  const origin = req.get('Origin');

  if (!allowedOrigins.includes(origin)) {
    console.log('Allowed origins:', allowedOrigins);
  console.log('Request origin:', origin);
    return res.status(403).send('Forbidden');
  }
  const { message } = req.body;
  
   const tokenCount = approximateTokenCount(message);
  
  // Check token count and return appropriate response
  if (tokenCount > 500) {
    res.json({ botResponse: '输入的字符过长，请控制在500字以内'});
    return res.status(404);
  }
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: message}],
    max_tokens: 500,
    temperature: 0.5,
  });
  res.json({ botResponse: completion.data.choices[0].message.content});
  console.log('requests:',message);
  console.log(completion.data.choices[0].message);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
