import { OpenAI } from "openai"
import dotenv from "dotenv"
import promptSync from "prompt-sync"
dotenv.config()


const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
})

async function run() {
    const input = promptSync({sigint:true}) 
    const userInput = input("Enter your message ")
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: userInput },

        ]
    })

    console.log(response.choices[0]?.message.content);

    

}
run()



let content: string = "Gen AI 2026 learning for career"

// console.log(content);
