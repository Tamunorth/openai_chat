import express from "express";

import * as dotenv from "dotenv";

import cors from "cors";

import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello there",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // const response = await openai.createImage({
    //   prompt: `${prompt}`,
    //   n: 10,
    //   size: "1024x1024",
    // });

    // let image_url = response.data.data
    //   .map((value) => `${value.url}`)
    //   .join("\n\n");

    // console.log(image_url);

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({ error });
  }
});

app.post("/images", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // const number = req.body.count;

    const response = await openai.createImage({
      prompt: `${prompt}`,
      n: 5,
      size: "1080x1920",
    });
    let image_url = response.data.data[0].url;

    res.status(200).send({
      bot: response.data.data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({ error });
  }
});
app.listen(3000, () => console.log("listening on port http://localhost:3000"));
