import type { ReactNode } from "react";

interface YouTubeEmbedProps {
  id: string;
  title: string;
}

function YouTubeEmbed({ id, title }: YouTubeEmbedProps): ReactNode {
  return (
    <div className="yt-embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export { YouTubeEmbed };
