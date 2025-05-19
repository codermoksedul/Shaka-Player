import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import VolumeSlider from "./VolumeSlider";

interface IVoluemControlProps {
  toggleMute: () => void;
  isMuted: boolean;
  volume: number;
  handleVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VolumeControl({
  toggleMute,
  isMuted,
  volume,
  handleVolume,
}: IVoluemControlProps) {
  return (
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
  );
}
