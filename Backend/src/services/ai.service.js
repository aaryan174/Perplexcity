import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import {HumanMessage, SystemMessage, AIMessage, tool, ToolMessage} from "langchain"
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.Generative_Language_API_Key
});



const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_AI_API_KEY
})

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
)

const modelWithTools = mistralModel.bindTools([ searchInternetTool ]);

export async function generateResponse(messages) {
    const formattedMessages = [
        new SystemMessage(`
            You are a helpful and precise assistant for answering questions.
            If you don't know the answer, say you don't know. 
            If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
        `),
        ...(messages.map(msg => {
            if (msg.role == "user") {
                return new HumanMessage(msg.content)
            } else if (msg.role == "ai") {
                return new AIMessage(msg.content)
            }
        }))
    ];

    let response = await modelWithTools.invoke(formattedMessages);

    let iterations = 0;
    while (response.tool_calls && response.tool_calls.length > 0 && iterations < 3) {
        formattedMessages.push(response);

        for (const toolCall of response.tool_calls) {
            try {
                const result = await searchInternet(toolCall.args);
                formattedMessages.push(new ToolMessage({
                    tool_call_id: toolCall.id,
                    name: toolCall.name,
                    content: result
                }));
            } catch (err) {
                formattedMessages.push(new ToolMessage({
                    tool_call_id: toolCall.id,
                    name: toolCall.name,
                    content: "Tool execution failed: " + err.message
                }));
            }
        }

        response = await modelWithTools.invoke(formattedMessages);
        iterations++;
    }

    let finalContent = response.content;
    if (typeof finalContent !== "string") {
        finalContent = JSON.stringify(finalContent);
    }
    
    if (!finalContent || finalContent.trim() === "") {
        finalContent = "I've processed the information but couldn't generate a textual response.";
    }

    return finalContent;
}

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are an AI assistant that generates a concise, engaging title from the user’s input. Analyze the message and produce a title strictly between 2 to 4 words that accurately reflects the core idea or theme. Keep it clear, meaningful, and relevant, using natural language without repetition or filler. Do not include explanations or extra text—output only the title.
`),
 new HumanMessage(`Generate a title for a chat conversation  based on the following first Message: "${message}"`)
    ]);
    return response.content;
}