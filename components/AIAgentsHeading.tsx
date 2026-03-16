"use client";

import TextType from "./TextType";

export default function AIAgentsHeading() {
  return (
    <TextType
      text={["Your AI team, working 24/7"]}
      typingSpeed={60}
      pauseDuration={2000}
      deletingSpeed={40}
      loop={true}
      showCursor={true}
      cursorCharacter="_"
      cursorBlinkDuration={0.5}
      className="font-syne text-4xl md:text-5xl font-black tracking-tight"
    />
  );
}
