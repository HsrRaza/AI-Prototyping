import { OpenAI } from "openai"

import dotenv from "dotenv"

dotenv.config()


const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
})




async function callOpenAITools() {

    const context :OpenAI.ChatCompletionMessageParam[] = [
    { role:"system", content:"You are a helpfull assistant"},
    {role: "user", content:"what is current time in new york"}
]
    
    
    
    const response  = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: context
    })


    console.log(response.choices[0]?.message.content);
    
    
}

callOpenAITools()
