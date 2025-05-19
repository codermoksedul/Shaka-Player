"use client";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

export default function PlayerPage() {
  const streamId = "a707baca-2b5b-4860-b6f2-3bb9ae2742c9";
  const [networkSpeed, setNetworkSpeed] = useState<string | null>(null);

  useEffect(() => {
    const connection = (navigator as any).connection;

    if (!connection) {
      setNetworkSpeed(null);
      return;
    }

    // Initial speed set
    if (connection.downlink) {
      setNetworkSpeed(`${connection.downlink} Mbps`);
    }

    // Event handler for connection changes
    const updateSpeed = () => {
      setNetworkSpeed(
        connection.downlink ? `${connection.downlink} Mbps` : null
      );
    };

    connection.addEventListener("change", updateSpeed);

    // Cleanup on unmount
    return () => {
      connection.removeEventListener("change", updateSpeed);
    };
  }, []);

  return (
    <div>
      <div className="fixed top-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded z-50">
        {networkSpeed ? `Speed: ${networkSpeed}` : "Measuring..."}
      </div>
      <VideoPlayer
        connectionSpeed={networkSpeed}
        url={`${process.env.NEXT_PUBLIC_STREAMING_URI}/${streamId}/playback.m3u8`}
      />
    </div>
  );
}
