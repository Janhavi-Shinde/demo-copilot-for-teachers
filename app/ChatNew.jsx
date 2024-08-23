"use client";

import { useChat } from "ai/react";
import { useEffect } from "react";
import Assignment from "./Assignment";
import "./styles.css";

export default function ChatNew({
  studentWriting,
  learningOutcomes,
  markingCriteria,
  feedbackPrompt,
}) {
  const { messages, input, handleInputChange, handleSubmit, append } =
    useChat();

  const initializeChat = () => {
    // Convert the marking criteria and learning outcomes into formatted strings
    const formattedMarkingCriteria = Object.entries(Assignment.markingCriteria)
      .map(
        ([category, criteria]) =>
          `${category}:\n${criteria
            .map((criterion) => `- ${criterion}`)
            .join("\n")}`
      )
      .join("\n\n");

    const formattedLearningOutcomes = Object.entries(
      Assignment.learningOutcomes
    )
      .map(
        ([outcome, criteria]) =>
          `${outcome}:\n${criteria
            .map((criterion) => `- ${criterion}`)
            .join("\n")}`
      )
      .join("\n\n");

    // Construct the initial message with all the necessary context
    const initialMessage = `
      Here is the student's writing: ${studentWriting}

      Here is the marking criteria:
      ${formattedMarkingCriteria}

      Here are the learning outcomes:
      ${formattedLearningOutcomes}

      You are to use this information to further help the student. 
      You will start by saying "Hi, how can I help?" and will NOT continue until you have received input from the user. THIS IS VITAL!!!!
    `;

    console.log("Initial Message:", initialMessage); // Debugging: Check the message content

    // Append the initial message to the chat
    append({
      role: "user", // You can adjust the role if needed
      content: initialMessage.trim(), // Trimming any extra spaces
    });
  };

  // Initialize the chat when the component is first rendered
  useEffect(() => {
    initializeChat();
  }, []); // Empty dependency array to ensure this only runs once on mount

  return (
    <div>
      {/* Map starting from the second element */}
      {messages.slice(1).map((m) => (
        <div
          key={m.id}
          className="assignment-module-chat"
          style={{
            backgroundColor: m.role === "user" ? "white" : "black",
            color: m.role === "user" ? "black" : "white", // Adjust text color for contrast
          }}
        >
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
