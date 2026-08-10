import OpenAI from "openai";
import dotenv from "dotenv";

import { join, dirname } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

dotenv.config();

type Fruits = {
  id: string;
  name: string;
  description: string;
  embedding?: number[];
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY
})


const dotProduct = (vec1: number[], vec2: number[]) => {
  return vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);

}

const cosineSimilarity = (vec1: number[], vec2: number[]) => {
  const dotProd = dotProduct(vec1, vec2);
  const magnitude1 = Math.sqrt(dotProduct(vec1, vec1));
  const magnitude2 = Math.sqrt(dotProduct(vec2, vec2));

  return dotProd / (magnitude1 * magnitude2);
}
const similaritySearch = (fruits: Fruits[], target: Fruits) => {

  const simiarities = fruits.filter(fruit => fruit.id !== target.id).map(fruit => ({
    name: fruit.name,
    dot: dotProduct(target.embedding!, target.embedding!),

    cosine: cosineSimilarity(target.embedding!, fruit.embedding!)

  })).sort((a, b) => b.cosine - a.cosine);

  return simiarities;


}


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadFruitJsonFile<T>(fileName: string): T {

  const filePath = join(__dirname, fileName);

  const rawData = readFileSync(filePath, "utf-8");

  return JSON.parse(rawData);
}

// console.log(loadFruitJsonFile("fruits.json"));



async function generateEmbeddings(fruitsDescriptions: string[]) {

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: fruitsDescriptions
  });

  console.log("Embedding Response: ", response)


  return response;
}


function saveDataToJsonFile(fileName: string, data: any) {
  const filePath = join(__dirname, fileName);
  const jsonData = JSON.stringify(data, null, 2);
  writeFileSync(filePath, jsonData, 'utf-8');


}



async function run() {
  const fruits: Fruits[] = loadFruitJsonFile("fruits.json");

  const fruitsDescriptions = fruits.map((fruit: Fruits) => fruit.description);

  const embeddings = await generateEmbeddings(fruitsDescriptions);


  const fruitsWithEmbeddings = fruits.map((fruit: Fruits, index: number) => ({
    ...fruit,
    embedding: embeddings?.data[index]?.embedding
  }));

  console.log("Fruits with Embeddings: ", fruitsWithEmbeddings);


  saveDataToJsonFile("fruits_with_embeddings.json", fruitsWithEmbeddings);

  const targetFruit = fruitsWithEmbeddings.find(fruit => fruit.name === "Apple");
  
  if (!targetFruit || !targetFruit.embedding) {
    console.log("Target fruit not found.");
    return;
  }


  const similarFruits = similaritySearch(fruitsWithEmbeddings ,targetFruit);
  
  console.log("Similar Fruits to Apple: ", `${similarFruits}`);

  similarFruits.forEach(fruit => {
    console.log(`Fruit: ${fruit.name}, Dot Product: ${fruit.dot}, Cosine Similarity: ${fruit.cosine}`);
  });

  console.log("Done");
  
}

run()