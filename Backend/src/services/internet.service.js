import { TavilySearch } from "@langchain/tavily"

const tavily = new TavilySearch({
    apiKey: process.env.TAVILY_API_KEY,
    maxResults: 5,
})

export const searchInternet = async ({ query }) => {
    const results = await tavily.invoke({ query });

    return typeof results === 'string' ? results : JSON.stringify(results);
}