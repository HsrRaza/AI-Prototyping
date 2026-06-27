import { OpenAI } from "openai"
import dotenv from "dotenv"
import promptSync from "prompt-sync"
dotenv.config()


const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
})

type Context = {
    role: 'user'| 'assistant' | 'system',
    content: string
}[]

const context: Context = [
    {
        role: "system",
        content: "You are helpfull assistant"
    },
    {
        role: "user",
        content: "Hello how are you"
    }
];
async function chatCompletion() {
    const response = await openai.chat.completions.create({
        messages: context,
        model: "gpt-3.5-turbo",

    })
    const responseMessage = response.choices[0]?.message;
    context.push({
        role: "assistant",
        content: responseMessage?.content
    })

    console.log(`Assistant : ${response.choices[0]?.message.role}` , response.choices[0]?.message.content );
    
}


async function run() {
    const input = promptSync({ sigint: true })

    while (true) {
        const userInput = input() as string

        if (userInput.toLowerCase() === "exit") {
            console.log("Exiting the chat");
            break;
        }


        context.push({
            role:"user",
            content:userInput
        })

        await chatCompletion()

    }





}
run()



let content: string = "Gen AI 2026 learning for career"

// console.log(content);
