import type { UIState } from "../app/actions";
import React from "react";

interface MessagesProps {
  messages: UIState;
}

export function ChatList({ messages }: MessagesProps) {
  if (!messages.length) return null;
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={message.id} className="pb-4">
          {message.display}
        </div>
      ))}
    </div>
  );
}