"use client";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect, useRef, useState } from "react";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FaExpand } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { IoReloadOutline } from "react-icons/io5";
import SettingsControl from "./settings";
import VolumeControl from "./voliume";

interface QualityOption {
  label: string;
  value: string;
}

interface ControllerProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  showSettings: boolean;
  availableQualities: QualityOption[];
  showControls: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  handleVolume: (e: any) => void;
  handleSeek: (e: any) => void;
  toggleFullscreen: () => void;
  handleSettings: () => void;
  handlePlaybackRate: (rate: number) => void;
  handleQualityChange: (quality: string) => void;
  handlePrev: () => void;
  handleNext: () => void;
  isLoading: boolean;
  currentQuality: string;
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
      <div
        onClick={togglePlay}
        className="w-full absolute z-10 h-full left-0 top-0 opacity-0"
      />

      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/40 bg-opacity-50">
          <div className="animate-spin rounded-full w-[30px] h-[30px] lg:w-[50px] lg:h-[50px]">
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

      <div
        className={`absolute pointer-events-none left-0 z-20 transition-all duration-500 top-0 w-full h-full flex flex-row gap-7 lg:gap-52 justify-center items-center bg-black/10 ${
          !isPlaying && !isLoading
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="bg-themePrimaryColor pointer-events-auto text-white lg:text-2xl text-xl p-2 lg:p-4 rounded-full"
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

      <div
        className={`absolute z-20 bottom-0 transition-all duration-500 left-0 right-0 bg-gradient-to-b from-transparent from-20% to-black text-white px-2 py-0 lg:p-2 flex flex-col gap-0 ${
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
        <div className="flex justify-between gap-2 lg:gap-4 items-center text-sm">
          <div className="flex flex-row justify-start items-center gap-1 lg:gap-4">
            <div className="flex flex-row gap-0 items-center">
              <button
                className={`text-white pointer-events-auto flex flex-row justify-center items-center opacity-80 hover:opacity-100 transition-all duration-300 gap-0 text-sm p-1 lg:p-2 ${
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
                className={`text-white flex flex-row pointer-events-auto justify-center items-center opacity-80 hover:opacity-100 transition-all duration-300 gap-0 text-sm p-1 lg:p-2 ${
                  currentTime > duration - 10
                    ? "!opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={handleNext}
              >
                <CgPlayTrackNext className="text-xl" />
              </button>
            </div>

            <div className="text-nowrap text-[12px]">
              <span className="hidden lg:flex">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <span className="lg:hidden">
                {"-" + formatTime(duration - currentTime)}
              </span>
            </div>

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              handleVolume={handleVolume}
              toggleMute={toggleMute}
            />
          </div>

          <div className="flex flex-row gap-0 lg:gap-1 items-center">
            <SettingsControl
              showSettings={showSettings}
              settingsStep={settingsStep}
              setSettingsStep={setSettingsStep}
              handleSettings={handleSettings}
              handlePlaybackRate={handlePlaybackRate}
              handleQualityChange={handleQualityChange}
              availableQualities={availableQualities}
              currentQuality={currentQuality}
              playbackRate={playbackRate}
            />

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
