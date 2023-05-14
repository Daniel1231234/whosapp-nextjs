import { Configuration, OpenAIApi } from "openai";


const config = new Configuration({
    organization: "org-HraJhbq5JUyHM1x5YJxmtmWy",
    apiKey: process.env.OPENAI_API_KEY
})

export const openai = new OpenAIApi(config)