import { OpenAI } from "openai"

import dotenv from "dotenv"

dotenv.config()


const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
})



function getTimeInNewYork(){
    return new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
}

async function callOpenAITools() {

    const context :OpenAI.ChatCompletionMessageParam[] = [
    { role:"system", content:"You are a helpfull assistant"},
    {role: "user", content:"what is current time in new york"}
]
    
    
    
    const response  = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: context,
        tools:[
            {
                type:"function",
                function:{

                    name:"getTimeInNewYork",
                    description:"Get current time in New York",
                }
            }
        ],
        tool_choice:'auto' // auto tool decision
    });

    // step 2 :decide the tool to use and call the tool
    const willInvokeTheTool = response.choices[0]?.finish_reason ==="tool_calls";

    const toolCall = response.choices[0]?.message.tool_calls?.[0];

    if(willInvokeTheTool && toolCall && "function" in toolCall){
        
        const toolName  = toolCall.function.name;

        if(toolName === "getTimeInNewYork"){
            const toolResponse = getTimeInNewYork();
            console.log("Tool Response: ", toolResponse);

            context.push(response.choices[0]!.message);
            context.push({role:"tool",  content:toolResponse , tool_call_id:toolCall?.id ?? " "});
        }
    }

    const secondResponse  = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: context,
    });




    console.log(secondResponse.choices[0]?.message.content);
    
    
}

callOpenAITools()
