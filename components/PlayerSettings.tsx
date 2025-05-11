"use client";
import React from "react";
import { FaAngleLeft } from "react-icons/fa6";

interface PlayerSettingsProps {
  settingsStep: "main" | "speed" | "quality";
  playbackRate: number;
  availableQualities: number[];
  currentQuality: number;
  setSettingsStep: (step: "main" | "speed" | "quality") => void;
  handlePlaybackRate: (rate: number) => void;
  handleQualityChange: (quality: number) => void;
  handleSettings: () => void;
}

const PlayerSettings: React.FC<PlayerSettingsProps> = ({
  settingsStep,
  playbackRate,
  availableQualities,
  currentQuality,
  setSettingsStep,
  handlePlaybackRate,
  handleQualityChange,
  handleSettings,
}) => {
  return (
    <div className="w-[100px] absolute bg-white right-0 bottom-10 z-10 text-black p-2 rounded shadow">
      {settingsStep === "main" && (
        <>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-themePrimaryColor hover:text-white transition-all duration-300 rounded"
            onClick={() => setSettingsStep("speed")}
          >
            Speed
          </button>
          {availableQualities.length > 0 && (
            <button
              className="block w-full text-left px-2 py-1 hover:bg-themePrimaryColor hover:text-white transition-all duration-300 rounded"
              onClick={() => setSettingsStep("quality")}
            >
              Quality
            </button>
          )}
        </>
      )}

      {settingsStep === "speed" && (
        <>
          <button
            className="text-sm flex flex-row justify-start items-center gap-1 border-b w-full pb-1 mb-2"
            onClick={() => setSettingsStep("main")}
          >
            <FaAngleLeft /> Speed
          </button>
          {[0.25, 0.5, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                handlePlaybackRate(rate);
                handleSettings();
                setSettingsStep("main");
              }}
              className={`block w-full text-left px-2 py-1 hover:bg-themePrimaryColor hover:text-white transition-all duration-300 rounded ${
                playbackRate === rate ? "bg-themePrimaryColor text-white" : ""
              }`}
            >
              {rate}x
            </button>
          ))}
        </>
      )}

      {settingsStep === "quality" && (
        <>
          <button
            className="text-sm flex flex-row justify-start items-center gap-1 border-b w-full pb-1 mb-2"
            onClick={() => setSettingsStep("main")}
          >
            <FaAngleLeft /> Quality
          </button>
          {/* Available quality options */}
          {availableQualities.map((q) => (
            <button
              key={q}
              onClick={() => {
                handleQualityChange(q);
                handleSettings();
                setSettingsStep("main");
              }}
              className={`block w-full text-left px-2 py-1 hover:bg-themePrimaryColor hover:text-white transition-all duration-300 rounded ${
                currentQuality === q ? "bg-themePrimaryColor text-white" : ""
              }`}
            >
              {q}p
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default PlayerSettings;
