import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import {HumanMessage, SystemMessage} from "@langchain/core/messages"

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.Generative_Language_API_Key
});

export async function generateResponse(message) {
    const response = await geminiModel.invoke([
        new HumanMessage(message)
    ]);
    return response.content;
}

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_AI_API_KEY
})

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are an AI assistant that generates a concise, engaging title from the user’s input. Analyze the message and produce a title strictly between 2 to 4 words that accurately reflects the core idea or theme. Keep it clear, meaningful, and relevant, using natural language without repetition or filler. Do not include explanations or extra text—output only the title.
`),
 new HumanMessage(`Generate a title for a chat conversation  based on the following first Message: "${message}"`)
    ]);
    return response.content;
}