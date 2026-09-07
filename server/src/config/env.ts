const requiredEnv = [
    "MONGODB_URI",
    "JWT_SECRET",
    "OPENAI_API_KEY",
];

for (const key of requiredEnv) {

    if (!process.env[key]) {
        throw new Error(
            `${key} is not configured`
        );
    }
}

export const env = {
    mongodbUri:
        process.env.MONGODB_URI!,

    jwtSecret:
        process.env.JWT_SECRET!,

    openaiApiKey:
        process.env.OPENAI_API_KEY!,

    clientUrl:
        process.env.CLIENT_URL ??
        "http://localhost:3000",

    port:
        Number(
            process.env.PORT ?? 5000
        ),
};