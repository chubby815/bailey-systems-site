"use client";

import TextType from "./TextType";

export default function HeroHeadline() {
  return (
    <h1
      className="text-4xl md:text-6xl font-black leading-tight mb-6"
      style={{
        fontFamily: "var(--font-tactical)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "#e5e5e0",
      }}
    >
      AI BUILDS YOUR BUSINESS<br />
      WEBSITE IN{" "}
      <TextType
        text={[
          "60 SECONDS",
          "MINUTES, NOT MONTHS",
          "ONE CLICK",
          "SECONDS FLAT",
        ]}
        typingSpeed={60}
        deletingSpeed={40}
        pauseDuration={2000}
        showCursor={true}
        cursorCharacter="▮"
        className="tac-amber"
      />
    </h1>
  );
}
