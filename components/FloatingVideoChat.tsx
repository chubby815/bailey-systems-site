"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export function FloatingVideoChat() {
  const [baileyInput, setBaileyInput] = useState("");
  const [baileyResponse, setBaileyResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const keySequenceRef = useRef<string>("");

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 0.6; 
    }
  }, []);

  // Easter Egg: Listen for "woof" being typed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only track if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      keySequenceRef.current += e.key.toLowerCase();

      // Keep only the last 4 characters
      if (keySequenceRef.current.length > 4) {
        keySequenceRef.current = keySequenceRef.current.slice(-4);
      }

      // Check if "woof" was typed
      if (keySequenceRef.current === "woof") {
        triggerFlip();
        keySequenceRef.current = ""; // Reset
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  const triggerFlip = () => {
    setIsFlipping(true);
    setBaileyResponse("WOOF WOOF! 🐕");
    
    setTimeout(() => {
      setIsFlipping(false);
      setBaileyResponse("");
    }, 1000);
  };

  async function handleBaileyChat(e: FormEvent) {
    e.preventDefault();
    if (!baileyInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: `You are Bailey, the AI assistant for Bailey Systems AI. Answer this: ${baileyInput}` }]
        }),
      });
      const data = await response.json();
      setBaileyResponse(data?.message || "Woof! I'm Bailey! How can I help you today?");
      setBaileyInput("");
    } catch (error) {
      setBaileyResponse("Woof! Ask me about services or pricing!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <div className={`relative transition-transform duration-1000 ${isFlipping ? 'animate-spin-flip' : ''}`}>
          {baileyResponse && (
            <div className="absolute bottom-full mb-4 right-0 w-96 max-h-48 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="relative rounded-3xl bg-white px-6 py-4 shadow-[6px_6px_0_rgba(0,0,0,0.8)] border-[3px] border-black max-h-48 overflow-y-auto scrollbar-hide">
                <p className="font-bold text-black text-sm leading-relaxed">{baileyResponse}</p>
                <div className="absolute -bottom-6 right-12 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[24px] border-t-black" />
                <div className="absolute -bottom-5 right-12 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] border-t-white" />
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            src="/avatar.mp4"
            className="w-48 h-auto pointer-events-none" 
            style={{ background: 'transparent' }}
            muted
            playsInline
            autoPlay
            loop
            controls={false}
            preload="metadata"
            poster="/placeholder.jpg"
          />

          {/* --- LEFT FOOT PAWS (Covers Watermark 1) --- */}
          <div className="absolute bottom-4 left-6 z-30 text-3xl pointer-events-none animate-pulse">
            🐾
          </div>

          {/* --- RIGHT FOOT PAWS (Covers Watermark 2) --- */}
          <div className="absolute bottom-4 right-8 z-30 text-3xl pointer-events-none animate-pulse delay-100">
            🐾
          </div>

        </div>

        <form onSubmit={handleBaileyChat} className="flex gap-2 w-full max-w-sm">
          <input
            type="text"
            value={baileyInput}
            onChange={(e) => setBaileyInput(e.target.value)}
            placeholder="Ask Bailey anything..."
            className="flex-1 rounded-full border-2 border-black bg-white px-4 py-2 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[3px_3px_0_rgba(0,0,0,0.8)]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] transition-all hover:shadow-[1px_1px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] flex-shrink-0"
          >
            <Send size={16} className="text-black" />
          </button>
        </form>
        <p className="text-xs text-white/90 text-right mr-2">
          🐕 Bailey handles ALL inquiries!
        </p>
      </div>
    </>
  );
}