import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY

})

const docs = [
 "Node.js runtime",
 "React frontend library",
 "PostgreSQL relational database"
];

const embedding = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: docs
});

const store = docs.map((doc , index) => ({
  text:doc,
  embedding:embedding.data[index].embedding
}))

store.forEach(doc=>{
  console.log(doc.text);
  console.log(doc.embedding.length);
    
})

// console.log(store);


// console.log(embedding.data[0].embedding.length);
