import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY?.trim();
const model = process.env.OPENAI_MODEL?.trim();

export const isAIConfigured = Boolean(apiKey && model);

export const aiModel = model ?? "";

export const openai = apiKey
    ? new OpenAI({
        apiKey,
        timeout: 20_000,
        maxRetries: 2,
    })
    : null;
