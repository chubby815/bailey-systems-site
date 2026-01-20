import { VideoCard } from "@/components/VideoCard";
import { VIDEO_LIBRARY } from "@/utils/constants";

export default function VideosPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="section-label">Videos</p>
        <h1 className="text-4xl font-semibold text-white">
          Deep dives recorded with real customer data (anonymized).
        </h1>
        <p className="text-white/70">
          Short demos show how Bailey copilots qualify leads, fulfill scopes,
          and keep executives informed automatically.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {VIDEO_LIBRARY.map((video) => (
          <VideoCard key={video.title} video={video} />
        ))}
      </div>
    </div>
  );
}

