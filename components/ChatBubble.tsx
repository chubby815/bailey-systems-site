import { clsx } from "clsx";

type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div className="relative max-w-[80%]">
        {/* Comic Book Speech Bubble */}
        <div
          className={clsx(
            "relative rounded-2xl border-4 border-black px-6 py-4 shadow-[4px_4px_0_rgba(0,0,0,1)]",
            isUser
              ? "bg-yellow-300"
              : "bg-white",
          )}
        >
          <p className={clsx(
            "font-bold leading-relaxed",
            isUser ? "text-black" : "text-black"
          )}>
            {content}
          </p>
          {timestamp && (
            <span className="mt-2 block text-[9px] font-semibold uppercase tracking-wider text-black/50">
              {timestamp}
            </span>
          )}
          
          {/* Speech Bubble Tail */}
          <div
            className={clsx(
              "absolute -bottom-3 h-0 w-0 border-l-[15px] border-r-[15px] border-t-[15px] border-black",
              isUser
                ? "right-6 border-l-transparent"
                : "left-6 border-r-transparent",
            )}
          />
          <div
            className={clsx(
              "absolute -bottom-2 h-0 w-0 border-l-[12px] border-r-[12px] border-t-[12px]",
              isUser
                ? "right-[26px] border-l-transparent border-t-yellow-300"
                : "left-[26px] border-r-transparent border-t-white",
            )}
          />
        </div>
        
        {/* Comic Book "POW!" effect for assistant */}
        {!isUser && (
          <div className="absolute -right-8 -top-2 rotate-12 text-xs font-black text-yellow-400">
            🐕
          </div>
        )}
      </div>
    </div>
  );
}

