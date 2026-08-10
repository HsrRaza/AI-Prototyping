import { ChromaClient, EmbeddingFunction } from "chromadb"
import { OpenAI } from "openai"
import dotenv from "dotenv"

dotenv.config();

// initialize the OpenAI client with the OpenRouter API key


const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
})

// Initialize the Chroma client with the host and port of the Chroma server
const chromaClient = new ChromaClient({
    host: 'localhost',
    port: 8000,
})

// Embedding class

class openAIEmbeddings implements EmbeddingFunction {
    async generate(texts: string[]): Promise<number[][]> {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: texts
        })
        return response.data.map(item => item.embedding)
    }
}

// intialize collection

const init = async () => {
    const embedder = new openAIEmbeddings();
    const collection = await chromaClient.createCollection({
        name: "my_collection",
        embeddingFunction: embedder
    })
    return collection;
}

//  add message to collections
const addMessage = async (id: string, text: string) => {
    const collection = await init();
    await collection.add({
        ids: [id],
        documents: [text],

    })
    console.log(`Added text:${text}`);

}

const getSimilarMessage 



// chromaClient.heartbeat();