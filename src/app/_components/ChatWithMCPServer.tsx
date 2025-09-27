// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// let client: Client | undefined = undefined;
// const baseUrl = new URL("http://localhost:4000/mcp");

// const connectToServer = async () => {
//   try {
//     client = new Client({
//       name: "streamable-http-client",
//       version: "1.0.0",
//     });
//     const transport = new StreamableHTTPClientTransport(new URL(baseUrl));
//     await client.connect(transport);
//     // await client.request(
//     //   {
//     //     method: "initialize",
//     //     params: {
//     //       protocolVersion: "1.0",
//     //       capabilities: {},
//     //       clientInfo: {
//     //         name: "streamable-http-client",
//     //         version: "1.0.0",
//     //       },
//     //     },
//     //   },
//     //   z.any(),
//     // );

//     console.log("client", client);
//     console.log("Connected using Streamable HTTP transport");

//     return client;
//   } catch (error) {
//     console.log("asdf", error);
//     // If that fails with a 4xx error, try the older SSE transport
//     console.log(
//       "Streamable HTTP connection failed, falling back to SSE transport",
//     );
//     // client = new Client({
//     //   name: "sse-client",
//     //   version: "1.0.0",
//     // });
//     // const sseTransport = new SSEClientTransport(baseUrl);
//     // await client.connect(sseTransport);
//     // console.log("Connected using SSE transport");
//   }
// };

// const ChatWithMCPServer = () => {
//   const clientRef = useRef<Client | null>(null);
//   const [messages, setMessages] = useState<
//     { type: "sent" | "received"; text: string }[]
//   >([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     // Connect to MCP server once
//     connectToServer()
//       .then(async (client) => {
//         clientRef.current = client;
//         const toolsList = await client?.listTools(); // SDK method
//         console.log("asdf", toolsList);
//       })
//       .catch((err) => {
//         console.error("Failed to connect:", err);
//       });

//     return () => {
//       clientRef.current?.close?.();
//     };
//   }, []);

//   const sendMessage = async () => {
//     if (!clientRef.current || !input.trim()) return;

//     // Add user message to chat
//     setMessages((prev) => [...prev, { type: "sent", text: input }]);

//     try {
//       // Send request to MCP server
//       const response = await clientRef.current.complete

//       // Add MCP server response
//       setMessages((prev) => [
//         ...prev,
//         { type: "received", text: JSON.stringify(response) },
//       ]);
//     } catch (err) {
//       console.error("Error sending message:", err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "received", text: "Error: " + err },
//       ]);
//     }

//     setInput("");
//   };

//   return (
//     <div>
//       ChatWithMCPServer
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type a message..."
//       />
//       <button onClick={sendMessage} disabled={!clientRef.current}>
//         Send
//       </button>
//     </div>
//   );
// };

// export default ChatWithMCPServer;
