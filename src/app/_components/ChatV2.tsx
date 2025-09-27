import React from "react";
import OpenAI from "openai";
import ChatForm from "./ChatForm";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const chatWithLLM = async (
  message: string,
): Promise<{ type: "response" | "error"; message: string } | undefined> => {
  "use server";
  try {
    const response = await client.responses.create({
      model: "openai/gpt-oss-120b",
      input: [
        {
          type: "message",
          role: "user",
          content: message,
        },
      ],
      tools: [
        {
          type: "mcp",
          server_label: "todos",
          server_description:
            "A todo server that can perform CRUD operations like create, read, update, delete todos.",
          server_url: "https://todo-mcp-server.vercel.app/mcp",
          require_approval: "never",
        },
      ],
      stream: false,
    });

    return { type: "response", message: response.output_text };
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    console.log("Error: ", error.error);
    return {
      type: "error",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      message: error.error.message ?? "Something went wrong!!",
    };
  }
};

const ChatV2 = () => {
  return <ChatForm submitForm={chatWithLLM} />;
};

export default ChatV2;
