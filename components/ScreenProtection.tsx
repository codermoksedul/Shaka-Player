"use client";
import { useEffect, useState } from "react";

export default function ScreenProtection() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      setHidden(true);
      setTimeout(() => {
        setHidden(false);
      }, 1000);
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  //   use hardware press any button to black screen
  useEffect(() => {
    const handleHardwareKeyPress = (event: KeyboardEvent) => {
      if (event.key === "F1") {
        setHidden(true);
        setTimeout(() => {
          setHidden(false);
        }, 1000);
      }
    };

    window.addEventListener("keydown", handleHardwareKeyPress);

    return () => {
      window.removeEventListener("keydown", handleHardwareKeyPress);
    };
  }, []);

  return hidden ? (
    <div className="w-full h-full bg-black z-[9999] pointer-events-none select-none absolute left-0 top-0" />
  ) : null;
}
