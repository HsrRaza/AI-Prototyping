import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY

})

const docs = [
  "Node.js is a JavaScript runtime used for backend development.",
  "React is a frontend library developed by Facebook.",
  "PostgreSQL is a powerful relational SQL database.",
  "Redis is an in-memory database used for caching."
];
const embedding = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: docs
});

const store = docs.map((doc , index) => ({
  text:doc,
  embedding:embedding.data[index].embedding
}))


const question = "Which database should I learn first?";

const queryResponse = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: question,
});

const queryEmbedding = queryResponse.data[0].embedding;


const results = store.map(doc => ({
  text: doc.text,
  score: cosineSimilarity(queryEmbedding, doc.embedding),
}));

results.sort((a, b) => b.score - a.score);