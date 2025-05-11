"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import shaka from "shaka-player";
import Controller from "./Controller";
import DeveloperProtect from "./DeveloperProtect";
import DynamicWaterMark from "./DynamicWaterMark";
import ScreenProtection from "./ScreenProtection";

interface VideoPlayerProps {
  url: string;
  thumbnailUrl?: string;
  watermark?: boolean;
  protect?: boolean;
  developerProtect?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  thumbnailUrl,
  watermark = false,
  protect = false,
  developerProtect = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<shaka.Player | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<number[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isThumbnailVisible, setIsThumbnailVisible] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isAdaptive = url.endsWith(".mpd") || url.endsWith(".m3u8");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    if (isAdaptive) {
      if (!shaka.Player.isBrowserSupported()) {
        console.error("Shaka Player is not supported by this browser.");
        return;
      }

      shaka.polyfill.installAll();
      const shakaPlayer = new shaka.Player(video);
      setPlayer(shakaPlayer);

      shakaPlayer.configure({
        drm: {
          servers: {
            "com.widevine.alpha":
              "https://cwip-shaka-proxy.appspot.com/no_auth",
          },
        },
      });
      shakaPlayer
        .load(url)
        .then(() => {
          console.log("Video loaded successfully");

          setTimeout(() => {
            const tracks = shakaPlayer.getVariantTracks();
            console.log("Loaded tracks:", tracks);

            const qualities = Array.from(
              new Set<number>(tracks.map((t: any) => t.height).filter(Boolean))
            ).sort((a, b) => b - a);

            console.log("Available qualities found:", qualities);
            setAvailableQualities(qualities);
            if (qualities.length > 0) {
              setCurrentQuality(qualities[0]);
            }
          }, 500);
        })
        .catch((err: any) => {
          console.error("Shaka Player Error:", err);
        });

      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        shakaPlayer.destroy();
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("canplay", handleCanPlay);
      };
    } else {
      video.src = url;
      video.load();
      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
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
      setIsHovered(true);
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
          setIsHovered(false);
        }
      }, 2000);
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsThumbnailVisible(false);
          })
          .catch((e) => {
            if (
              e.name !== "AbortError" &&
              e.message !==
                "The play() request was interrupted by a call to pause()."
            ) {
              console.error("Play failed:", e);
            }
          });
      }
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
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      if (vol === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted && volume === 0) {
        setVolume(0.5);
        video.volume = 0.5;
      }
    }
  };

  const handlePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleSettings = () => setShowSettings(!showSettings);

  const handleQualityChange = (quality: number) => {
    if (!player || availableQualities.length === 0) return;

    const availableQualitiesBelowSelected = availableQualities.filter(
      (q) => q <= quality
    );
    const qualityToUse =
      availableQualitiesBelowSelected.length > 0
        ? Math.max(...availableQualitiesBelowSelected)
        : Math.min(...availableQualities);

    const tracks = player
      .getVariantTracks()
      .filter((t) => t.height === qualityToUse);
    if (tracks.length > 0) {
      player.selectVariantTrack(tracks[0], true);
      setCurrentQuality(qualityToUse);
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((e) =>
        console.error("Fullscreen error:", e)
      );
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

  return (
    <div
      ref={containerRef}
      className="relative w-full group aspect-video rounded-xl overflow-hidden bg-black shadow-lg"
    >
      {watermark && <DynamicWaterMark />}
      {protect && <ScreenProtection />}
      {developerProtect && <DeveloperProtect />}

      {isThumbnailVisible && thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt="Video Thumbnail"
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          width={1366}
          height={768}
          onClick={togglePlay}
        />
      )}

      <video
        ref={videoRef}
        className="w-full h-full bg-black"
        controls={false}
        autoPlay={false}
        muted={isMuted}
        poster={thumbnailUrl}
      />

      {/* show current time and duration */}
      <div>
        <div className="absolute top-2 left-2 text-white">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <span>
              {new Date(currentTime * 1000).toISOString().substr(11, 8)} /{" "}
              {new Date(duration * 1000).toISOString().substr(11, 8)}
            </span>
          )}
        </div>
      </div>

      <Controller
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        showSettings={showSettings}
        availableQualities={availableQualities}
        currentQuality={currentQuality}
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
      />
    </div>
  );
};

export default VideoPlayer;
