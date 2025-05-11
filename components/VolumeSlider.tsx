"use client";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect } from "react";

interface VolumeSliderProps {
  volume: number;
  isMuted: boolean;
  onChange: (value: number) => void;
}

const VolumeSlider = ({ volume, isMuted, onChange }: VolumeSliderProps) => {
  // Initialize volume from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedVolume = localStorage.getItem("videoPlayerVolume");
        if (savedVolume) {
          const volumeValue = parseFloat(savedVolume);
          if (!isNaN(volumeValue)) {
            onChange(Math.min(1, Math.max(0, volumeValue)));
          }
        }
      } catch (e) {
        console.error("Failed to read volume from localStorage", e);
      }
    }
  }, [onChange]);

  const handleChange = (value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;

    try {
      localStorage.setItem("videoPlayerVolume", newVolume.toString());
    } catch (e) {
      console.error("Failed to save volume to localStorage", e);
    }

    onChange(newVolume);
  };

  return (
    <Slider
      min={0}
      max={1}
      step={0.01}
      value={isMuted ? 0 : volume}
      onChange={handleChange}
      trackStyle={[{ backgroundColor: "#ed1c24" }]}
      handleStyle={[{ borderColor: "#ed1c24" }]}
      railStyle={{ backgroundColor: "#fdfdfd70" }}
      className="cursor-pointer w-24"
    />
  );
};

export default VolumeSlider;
