"use client";

import TextType from "./TextType";

export default function HeroHeadline() {
  return (
    <h1 className="font-syne text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
      AI Builds Your Business<br />
      Website in{" "}
      <TextType
        text={[
          "60 Seconds",
          "Minutes, Not Months",
          "One Click",
          "Seconds Flat",
        ]}
        typingSpeed={60}
        deletingSpeed={40}
        pauseDuration={2000}
        showCursor={true}
        cursorCharacter="_"
        className="text-[#00e5a0]"
      />
    </h1>
  );
}
