"use client";

import type { Level } from "hls.js";
import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import DeveloperProtect from "./DeveloperProtect";
import DynamicWaterMark from "./DynamicWaterMark";
import Controller from "./controls/Controller";
import KeyboardControl from "./controls/KeyboardControl";

interface VideoPlayerProps {
  url: string;
  connectionSpeed?: string | null;
  onStatusUpdate?: (status: {
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    isPaused: boolean;
    isBuffering: boolean;
    isFinished: boolean;
  }) => void;
  isWatermarkEnabled?: boolean;
  isProtectionEnabled?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  onStatusUpdate,
  isProtectionEnabled = true,
  isWatermarkEnabled,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsStep, setSettingsStep] = useState<
    "main" | "speed" | "quality"
  >("main");
  const [availableLevels, setAvailableLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);

  // Notify parent about status changes
  useEffect(() => {
    if (!onStatusUpdate) return;

    const isPaused = !isPlaying && currentTime > 0 && currentTime < duration;
    const isFinished = duration > 0 && currentTime >= duration;
    const isBuffering = isLoading;

    onStatusUpdate({
      currentTime,
      duration,
      isPlaying,
      isPaused,
      isBuffering,
      isFinished,
    });
  }, [currentTime, duration, isPlaying, isLoading, onStatusUpdate]);

  const handleSettings = () => {
    setShowSettings((prev) => !prev);
    setSettingsStep((prev) =>
      prev === "main" ? "speed" : prev === "speed" ? "quality" : "main"
    );
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setAvailableLevels(hls.levels);
        setCurrentLevel(-1);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_: any, data: any) => {
        setCurrentLevel(data.level);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      hlsRef.current?.destroy();
    };
  }, [url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 2000);
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = value;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  const handleNext = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        duration
      );
    }
  };

  const handlePrev = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 10,
        0
      );
    }
  };

  const handleSeekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.min(
      Math.max(videoRef.current.currentTime + seconds, 0),
      duration
    );
    videoRef.current.currentTime = newTime;
  };

  const handleQualityChange = (value: string) => {
    const level = parseInt(value, 10);
    if (!isNaN(level) && hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentLevel(level);
    }
  };

  const qualityOptions = [
    { label: "Auto", value: "-1" },
    ...availableLevels.map((level, index) => ({
      label: `${level.height}p`,
      value: index.toString(),
    })),
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full group aspect-video rounded-xl overflow-hidden bg-black shadow-lg"
    >
      <video
        ref={videoRef}
        className="w-full h-full bg-black"
        controls={false}
        autoPlay={false}
        muted={isMuted}
      />

      {/* watermark */}
      {isWatermarkEnabled && <DynamicWaterMark />}
      {/* protection */}
      {isProtectionEnabled && <DeveloperProtect />}

      {/* controls */}
      <KeyboardControl togglePlay={togglePlay} handleSeekBy={handleSeekBy} />
      <Controller
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        showSettings={showSettings}
        availableQualities={qualityOptions}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        handleVolume={handleVolume}
        handleSeek={handleSeek}
        toggleFullscreen={toggleFullscreen}
        handleSettings={handleSettings}
        handlePlaybackRate={handlePlaybackRate}
        handleQualityChange={handleQualityChange}
        handlePrev={handlePrev}
        handleNext={handleNext}
        showControls={showControls}
        isLoading={isLoading}
        currentQuality={currentLevel.toString()}
      />
    </div>
  );
};

export default VideoPlayer;
