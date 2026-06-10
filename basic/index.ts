import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
  baseURL:'https://openrouter.ai/api/v1',
  apiKey:process.env.OPENROUTER_API_KEY

})

//  first api calling

const response = await client.chat.completions.create({
  model:"openai/gpt-oss-120b:free",
  messages:[
    {
      role:"system",
       content:"You are a helpful programming assistant."
    },
    {
      role:"user",
      content:"explain javascript closures with an example"
    },
    
  ],
  temperature:0,
  max_completion_tokens:200

})

console.log(response.choices[0].message);
