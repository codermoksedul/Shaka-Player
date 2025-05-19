import { FiSettings } from "react-icons/fi";
import PlayerSettings from "../PlayerSettings";

interface QualityOption {
  label: string;
  value: string;
}

interface ISettingsControlProps {
  settingsStep: "main" | "speed" | "quality";
  playbackRate: number;
  availableQualities: QualityOption[];
  currentQuality: string;
  setSettingsStep: (step: "main" | "speed" | "quality") => void;
  handlePlaybackRate: (rate: number) => void;
  handleQualityChange: (quality: string) => void;
  handleSettings: () => void;
  showSettings: boolean;
}

export default function SettingsControl({
  settingsStep,
  playbackRate,
  availableQualities,
  currentQuality,
  setSettingsStep,
  handlePlaybackRate,
  handleQualityChange,
  handleSettings,
  showSettings,
}: ISettingsControlProps) {
  return (
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
  );
}
