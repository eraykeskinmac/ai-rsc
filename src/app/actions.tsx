"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import type { ReactNode } from "react";
import type { CoreMessage, ToolInvocation } from "ai";
import { openai } from "@ai-sdk/openai";
import { BotMessage } from "@/components/llm/message";
import { Loader2 } from "lucide-react";

// this is the system message we send to the LLM to instantiate the it
// this gives the LLm the context for the tool calling

const content = `\
  You are a crypto bot and you can help users get the prices of the cryptocurrencies, and besides that, you can also chat with users.

  Message inside [] means that it's a UI element or a user event. For example:

  - "[Price of BTC = 696969]" means that the interface of the cryptocurrencies price of BTC is shown to the user
  - "[Stats of BTC]" means that the interface of the cryptocurrency stats of BTC is shown to the user

  If the user wants the price, call \`get_crypto_price\` to show the price.
  If the user wants ther market cap or stats of given cryptocurrency, call \`get_crypto_stats\` to show the stats.
  If the user wants  a stock price, it is an impossible task, so you should respond that you are a demo and cannot do that.
  If the user wants anything else unrelated to the function calls \`get_crypto_price\` and \`get_crypto_stats\`,
  you should chat with the user and answer any questions they may have.
  `;

export const sendMessage = async (
  message: string
): Promise<{
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
}> => {
  const history = getMutableAIState<typeof AI>();

  history.update([
    ...history.get(),
    {
      role: "user",
      content: message,
    },
  ]);

  const reply = await streamUI({
    model: openai("gpt-4o-2024-05-13"),
    messages: [
      { role: "system", content, toolInvocations: [] },
      ...history.get(),
    ] as CoreMessage[],
    initial: (
      <BotMessage className="items-center flex shrink-0 select-none justify-center">
        <Loader2 className="w-5 animate-spin stroke-zinc-900" />
      </BotMessage>
    ),
  });

  return {
    id: Date.now(),
    role: "assistant",
    display: <p>hello</p>,
  };
};

export type AIState = Array<{
  id?: number;
  name?: "get_crypto_price" | "get_crypto_stats";
  role: "user" | "assistant" | "system";
  content: string;
}>;

export type UIState = Array<{
  id: number;
  role: "user" | "assistant";
  display: ReactNode;
  toolInvocations?: ToolInvocation[];
}>;

export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});
