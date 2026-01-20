import Image from "next/image";
import { Play } from "lucide-react";
import { VideoResource } from "@/utils/constants";

type VideoCardProps = {
  video: VideoResource;
};

export function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={video.href}
      target="_blank"
      rel="noreferrer"
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5"
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        width={1280}
        height={720}
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70 p-6 text-white">
        <div className="flex h-full flex-col justify-end space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-white/70">
            {video.category}
          </span>
          <h3 className="text-xl font-semibold">{video.title}</h3>
          <p className="text-sm text-white/70">{video.description}</p>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Play className="h-4 w-4" />
            Watch preview
          </div>
        </div>
      </div>
    </a>
  );
}

