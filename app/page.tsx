import VideoPlayer from "@/components/VideoPlayer";

export default function page() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl mx-auto">
        <VideoPlayer
          url="https://vz-a976679b-663.b-cdn.net/78e98b73-c3da-4143-8897-3a05cf58e0e2/playlist.m3u8"
          watermark={true}
        />
      </div>
    </div>
  );
}
