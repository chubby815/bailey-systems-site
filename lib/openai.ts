import OpenAI from "openai";

let client: OpenAI | null = null;

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

export async function generateAssistantReply(
  messages: { role: "user" | "assistant"; content: string }[],
) {
  const openai = getClient();

  if (!openai) {
    return {
      message:
        "Connect your OpenAI API key to stream live responses inside the Bailey cockpit.",
    };
  }

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  return {
    message: response.output_text ?? "Your copilots are ready to deploy.",
  };
}

