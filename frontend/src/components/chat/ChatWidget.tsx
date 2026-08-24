import { useEffect, useRef, useState } from "react";
import {
  useChatWithAIMutation,
  useGetChatMessagesQuery,
} from "../../store/services/chat.api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isLoadingMessages } = useGetChatMessagesQuery(
    undefined,
    {
      skip: !isOpen,
    },
  );

  const [chatWithAI, { isLoading: isSending }] = useChatWithAIMutation();

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isOpen, isSending]);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setMessage("");

    try {
      const result = await chatWithAI({
        query: trimmedMessage,
      }).unwrap();

      if (result.messages) {
        setMessages(result.messages);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((previous) => previous.filter((msg) => msg !== userMessage));
      setMessage(trimmedMessage);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-18 right-4 z-50 flex h-[400px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-amber-50 shadow-2xl sm:bottom-20 sm:right-6 sm:h-[520px] sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-background px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg">
                ✨
              </div>

              <div>
                <h3 className="text-sm font-semibold">Notes Assistant</h3>

                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <p className="text-xs text-muted-foreground">
                    Your personal notes AI
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-muted/20 px-3 py-4">
            {isLoadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  Loading conversation...
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  ✨
                </div>

                <h4 className="text-sm font-semibold">
                  Hi! I'm your Notes Assistant.
                </h4>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Ask me anything about your notes. I can help you understand,
                  improve, or find information from them.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isUser = msg.role === "user";

                  return (
                    <div
                      key={`${msg.createdAt}-${index}`}
                      className={`flex items-end gap-2 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs">
                          ✨
                        </div>
                      )}

                      <div
                        className={`max-w-[78%] whitespace-pre-wrap px-3.5 py-2.5 text-sm leading-5 shadow-sm ${
                          isUser
                            ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-2xl rounded-bl-md border bg-background text-foreground"
                        }`}
                      >
                        {msg.content}
                      </div>

                      {isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                          You
                        </div>
                      )}
                    </div>
                  );
                })}

                {isSending && (
                  <div className="flex items-end gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs">
                      ✨
                    </div>

                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border bg-background px-4 py-3 shadow-sm">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t bg-background p-3">
            <div className="rounded-xl border bg-muted/30 p-1.5 focus-within:ring-2 focus-within:ring-primary/20">
              <div className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your notes..."
                  rows={1}
                  disabled={isSending}
                  className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  ↑
                </button>
              </div>
            </div>

            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              Enter to send · Shift + Enter for new line
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-amber-50 text-xl text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
};

export default ChatWidget;
