import React, { useEffect } from "react";

interface KeyboardControlProps {
  togglePlay: () => void;
  handleSeekBy: (seconds: number) => void; // positive or negative seconds
}

const KeyboardControl: React.FC<KeyboardControlProps> = ({
  togglePlay,
  handleSeekBy,
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tagName = (e.target as HTMLElement)?.tagName?.toLowerCase();
      // Avoid triggering if typing in input/textarea/select etc.
      if (["input", "textarea", "select"].includes(tagName)) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeekBy(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeekBy(10);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, handleSeekBy]);

  return null; // no UI, just hooks into keyboard events
};

export default KeyboardControl;
