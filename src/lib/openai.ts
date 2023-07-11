import { Configuration, OpenAIApi } from "openai";
import * as config from "../config/configuration"

const openAIconfig = new Configuration({
    organization: "org-HraJhbq5JUyHM1x5YJxmtmWy",
    apiKey: config.default().openaiApiKey
})

export const openai = new OpenAIApi(openAIconfig)