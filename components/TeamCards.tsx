"use client";

import ProfileCard from "./ProfileCard";

export default function TeamCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
      <ProfileCard
        name="Javier Sandoval"
        title="Founder & AI Developer"
        handle="javiersandoval"
        status="Online"
        contactText="Connect"
        showUserInfo={true}
        enableTilt={true}
        behindGlowEnabled={true}
        behindGlowColor="rgba(0, 229, 160, 0.5)"
        innerGradient="linear-gradient(145deg, #00e5a022 0%, #00665544 100%)"
      />
      <ProfileCard
        name="Rosa Sandoval"
        title="Media Director"
        handle="rosasandoval"
        status="Online"
        contactText="Connect"
        showUserInfo={true}
        enableTilt={true}
        behindGlowEnabled={true}
        behindGlowColor="rgba(168, 85, 247, 0.5)"
        innerGradient="linear-gradient(145deg, #a855f722 0%, #66004444 100%)"
      />
      <ProfileCard
        name="Manny Sandoval"
        title="Head of Marketing"
        handle="mannysandoval"
        status="Online"
        contactText="Connect"
        showUserInfo={true}
        enableTilt={true}
        behindGlowEnabled={true}
        behindGlowColor="rgba(59, 130, 246, 0.5)"
        innerGradient="linear-gradient(145deg, #3b82f622 0%, #00004488 100%)"
      />
      <ProfileCard
        name="Bailey AI"
        title="Chief AI Agent"
        handle="baileyai"
        status="Always Active"
        contactText="Chat"
        showUserInfo={true}
        enableTilt={true}
        behindGlowEnabled={true}
        behindGlowColor="rgba(0, 229, 160, 0.7)"
        innerGradient="linear-gradient(145deg, #00e5a033 0%, #0066ff33 100%)"
      />
    </div>
  );
}
