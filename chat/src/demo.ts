import { OpenAI } from "openai"

import dotenv from "dotenv"

dotenv.config()

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
});

async function run() {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",

        messages: [
            {
                role: "user",
                content: "Hello , How are you"

            },
            {
                role: 'assistant',
                content: "I am doing great , Thank you ! How can i assist you"

            },
            {
                role: 'system',
                content: "You are a helpfull assistant that provide information"

            }

        ]
    })

    console.log(response.choices[0])


}

run()