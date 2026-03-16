"use client";

import SplitText from "./SplitText";

export default function TeamHeading() {
  return (
    <SplitText
      text="The people behind Bailey"
      className="font-syne text-4xl md:text-5xl font-black tracking-tight mb-5"
      delay={50}
      duration={1.25}
      ease="power3.out"
      splitType="chars"
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
      threshold={0.1}
      rootMargin="-50px"
      textAlign="center"
      tag="h2"
    />
  );
}
