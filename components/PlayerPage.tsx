"use client";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

const StreamURI =
  process.env.NEXT_PUBLIC_STREAM_URI ||
  "https://cdn.uccrangpurbranch.com/uploads/streams/hls";

export default function PlayerPage() {
  const streamId = "a746ab0b-8a2d-4798-932f-a87c70d4b94a";
  const [networkSpeed, setNetworkSpeed] = useState<string | null>(null);

  // These track video state info
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection;
    if (!connection) {
      setNetworkSpeed(null);
      return;
    }
    if (connection.downlink) {
      setNetworkSpeed(`${connection.downlink} Mbps`);
    }
    const updateSpeed = () => {
      setNetworkSpeed(
        connection.downlink ? `${connection.downlink} Mbps` : null
      );
    };
    connection.addEventListener("change", updateSpeed);
    return () => {
      connection.removeEventListener("change", updateSpeed);
    };
  }, []);

  return (
    <div>
      <VideoPlayer
        connectionSpeed={networkSpeed}
        url={`${StreamURI}/${streamId}/playback.m3u8`}
        onStatusUpdate={(status) => {
          setPlayerCurrentTime(status.currentTime);
          setTotalDuration(status.duration);
          setIsPlaying(status.isPlaying);
          setIsPaused(status.isPaused);
          setIsBuffering(status.isBuffering);
          setIsFinished(status.isFinished);
        }}
        isWatermarkEnabled={true}
      />
      <div>
        playerCurrentTime: {playerCurrentTime.toFixed(2)} <br />
        totalDuration: {totalDuration.toFixed(2)} <br />
        isPlaying: {isPlaying ? "Yes" : "No"} <br />
        isPaused: {isPaused ? "Yes" : "No"} <br />
        isBuffering: {isBuffering ? "Yes" : "No"} <br />
        isFinished: {isFinished ? "Yes" : "No"} <br />
      </div>
    </div>
  );
}
