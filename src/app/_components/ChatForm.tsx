"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const ChatForm = ({
  submitForm,
}: {
  submitForm: (
    message: string,
  ) => Promise<{ type: "response" | "error"; message: string } | undefined>;
}) => {
  const [message, setMessage] = useState<
    { message: string; role: "user" | "llm"; type?: "error" | "response" }[]
  >([]);
  const [waitingForLLMResponse, setWaitingForLLMResponse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [message, waitingForLLMResponse]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userMessage: "",
    },
  });

  const onSubmit = async (data: { userMessage: string }) => {
    try {
      setMessage((prev) => [
        ...prev,
        { message: data.userMessage, role: "user" },
      ]);
      reset();
      setWaitingForLLMResponse(true);
      const response = await submitForm(data.userMessage);
      if (typeof response === "undefined") return;

      setMessage((prev) => [
        ...prev,
        { message: response.message, role: "llm", type: response.type },
      ]);
      setWaitingForLLMResponse(false);
    } catch (err) {
      console.log("Error: ", err);
      setWaitingForLLMResponse(false);
    }
  };

  console.log("Messages: ", message);

  return (
    <div className="flex h-[90vh] flex-col rounded-2xl bg-gray-500 p-4">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto pr-2" ref={containerRef}>
        {message?.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } ${msg.type === "error" ? "animate-shake" : ""}`}
          >
            <p
              className={`max-w-xs rounded-lg p-2 ${
                msg.type === "error"
                  ? "bg-red-500 text-white"
                  : msg.role === "user"
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}

        {waitingForLLMResponse && (
          <div className="mb-2 flex justify-start">
            <p className="max-w-xs rounded-lg bg-blue-500 p-2 text-white">
              LLM is typing...
            </p>
          </div>
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2 flex items-center gap-2 border-t border-gray-400 pt-2"
      >
        <input
          {...register("userMessage", { required: "Message is required" })}
          placeholder="Type your message..."
          className={`flex-1 rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
            errors.userMessage ? "border-red-300" : "border-slate-200"
          }`}
        />
        <button
          className="rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-2 text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
          type="submit"
          disabled={waitingForLLMResponse}
        >
          Send
        </button>
      </form>

      {errors.userMessage && (
        <p className="mt-1 text-sm text-red-500">
          {errors.userMessage.message}
        </p>
      )}
    </div>
  );
};

export default ChatForm;
