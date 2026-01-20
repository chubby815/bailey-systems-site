import { clsx } from "clsx";

type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <div
      className={clsx(
        "max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "ml-auto bg-brand-primary/90 text-white"
          : "bg-white/10 text-white/90",
      )}
    >
      <p>{content}</p>
      {timestamp && (
        <span className="mt-2 block text-[10px] uppercase tracking-wide text-white/50">
          {timestamp}
        </span>
      )}
    </div>
  );
}

