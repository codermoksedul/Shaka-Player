import PlayerPage from "@/components/PlayerPage";
import VideoPlayer from "@/components/VideoPlayer";

export default function page() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl mx-auto">
        <PlayerPage />
        {/* url="https://cdn.uccrangpurbranch.com/uploads/streams/hls/9311d3c9-5e10-48c0-ba98-78fad48060bf/playback.m3u8" /> */}
      </div>
    </div>
  );
}
