"use client";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect, useRef, useState } from "react";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FaExpand, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { IoReloadOutline } from "react-icons/io5";
import PlayerSettings from "./PlayerSettings";
import VolumeSlider from "./VolumeSlider";

interface ControllerProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  showSettings: boolean;
  availableQualities: number[];
  showControls: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  handleVolume: (e: any) => void;
  handleSeek: (e: any) => void;
  toggleFullscreen: () => void;
  handleSettings: () => void;
  handlePlaybackRate: (rate: number) => void;
  handleQualityChange: (quality: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
  isLoading: boolean;
  currentQuality: number;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const Controller: React.FC<ControllerProps> = ({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  playbackRate,
  showSettings,
  availableQualities,
  showControls,
  togglePlay,
  toggleMute,
  handleVolume,
  handleSeek,
  toggleFullscreen,
  handleSettings,
  handlePlaybackRate,
  handleQualityChange,
  handlePrev,
  handleNext,
  isLoading,
  currentQuality,
}) => {
  const [settingsStep, setSettingsStep] = useState<
    "main" | "speed" | "quality"
  >("main");
  const settingsRef = useRef<HTMLDivElement>(null);

  // Outside click to close settings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        handleSettings();
        setSettingsStep("main");
      }
    };

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings, handleSettings]);

  return (
    <>
      {/* Invisible click-to-pause overlay */}
      <div
        onClick={togglePlay}
        className="w-full absolute z-10 h-full left-0 top-0 opacity-0"
      ></div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full w-[50px] h-[50px]">
            <svg
              className="w-full h-full text-themePrimaryColor animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" className="opacity-25" />
              <path
                d="M4.93 4.93a10 10 0 0 1 14.14 14.14"
                className="opacity-75"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Center Controls */}
      <div
        className={`absolute pointer-events-none left-0 z-20 transition-all duration-500 top-0 w-full h-full flex flex-row gap-7 lg:gap-52 justify-center items-center bg-black/10 ${
          !isPlaying && !isLoading
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="bg-themePrimaryColor pointer-events-auto text-white text-2xl p-4 rounded-full"
          onClick={togglePlay}
        >
          {currentTime !== duration ? (
            isPlaying ? (
              <IoMdPause />
            ) : (
              <IoMdPlay />
            )
          ) : (
            <IoReloadOutline />
          )}
        </button>
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute z-20 bottom-0 transition-all duration-500 left-0 right-0 bg-black/70 text-white p-2 flex flex-col gap-0 ${
          showControls
            ? "opacity-100 bottom-0"
            : "opacity-0 !-bottom-12 pointer-events-none"
        }`}
      >
        <div className="w-full px-2">
          <Slider
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(value) =>
              handleSeek({
                target: {
                  value,
                } as unknown as React.ChangeEvent<HTMLInputElement>["target"],
              } as React.ChangeEvent<HTMLInputElement>)
            }
            trackStyle={[{ backgroundColor: "#ed1c24" }]}
            handleStyle={[{ borderColor: "#ed1c24" }]}
            railStyle={{ backgroundColor: "#fdfdfd70" }}
            dotStyle={{ backgroundColor: "#ed1c24" }}
            className="cursor-pointer "
          />
        </div>
        <div className="flex justify-between gap-4 items-center text-sm">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-row gap-0 items-center">
              <button
                className={`text-white pointer-events-auto flex flex-row justify-center items-center opacity-80 hover:opacity-100 transition-all duration-300 gap-0 text-sm p-2 ${
                  currentTime < 10 ? "!opacity-50 pointer-events-none" : ""
                }`}
                onClick={handlePrev}
              >
                <CgPlayTrackPrev className="text-xl" />
              </button>
              <button className="vdoCtrlBtn" onClick={togglePlay}>
                {currentTime !== duration ? (
                  isPlaying ? (
                    <IoMdPause />
                  ) : (
                    <IoMdPlay />
                  )
                ) : (
                  <IoReloadOutline />
                )}
              </button>
              <button
                className={`text-white flex flex-row pointer-events-auto justify-center items-center opacity-80 hover:opacity-100 transition-all duration-300 gap-0 text-sm p-2 ${
                  currentTime > duration - 10
                    ? "!opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={handleNext}
              >
                <CgPlayTrackNext className="text-xl" />
              </button>
            </div>

            <div className="text-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="flex items-center gap-2">
              <button className="vdoCtrlBtn" onClick={toggleMute}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <div className="w-24">
                <VolumeSlider
                  volume={volume}
                  isMuted={isMuted}
                  onChange={(value) =>
                    handleVolume({
                      target: {
                        value,
                      } as unknown as React.ChangeEvent<HTMLInputElement>["target"],
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-1 items-center">
            {/* Settings dropdown */}
            <div className="relative">
              <button className="vdoCtrlBtn" onClick={handleSettings}>
                <FiSettings />
              </button>
              {showSettings && (
                <PlayerSettings
                  settingsStep={settingsStep}
                  playbackRate={playbackRate}
                  availableQualities={availableQualities}
                  currentQuality={currentQuality}
                  setSettingsStep={setSettingsStep}
                  handlePlaybackRate={handlePlaybackRate}
                  handleQualityChange={handleQualityChange}
                  handleSettings={handleSettings}
                />
              )}
            </div>

            <button className="vdoCtrlBtn" onClick={toggleFullscreen}>
              <FaExpand />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Controller;
