"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const DynamicWaterMark: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>(() =>
    new Date().toLocaleString()
  );
  const [position, setPosition] = useState<{ top: string; left: string }>({
    top: "10px",
    left: "10px",
  });

  // Fetch user's IP address
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIpAddress(data.ip);
      } catch (err) {
        console.error("Failed to fetch IP address:", err);
      }
    };

    fetchIP();

    // Update timestamp every 10 seconds
    const timestampInterval = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 10000);

    // Randomize position every 3 seconds
    const positionInterval = setInterval(() => {
      const randomTop = `${Math.floor(Math.random() * 80)}%`;
      const randomLeft = `${Math.floor(Math.random() * 80)}%`;
      setPosition({ top: randomTop, left: randomLeft });
    }, 3000);

    return () => {
      clearInterval(timestampInterval);
      clearInterval(positionInterval);
    };
  }, []);

  return (
    <>
      <div
        className="absolute z-50 text-sm text-red-500 font-semibold pointer-events-none select-none transition-all duration-700 ease-in-out"
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
        }}
      >
        <p className="flex flex-col">
          <span>UCC Rangpur</span>
          IP: {ipAddress || "..."}
        </p>
      </div>
      <div className="w-full h-full left-0 top-0 absolute z-50 pointer-events-none select-none flex justify-center items-center opacity-10">
        <Image
          src="/images/icon.svg"
          alt="Watermark"
          width={50}
          height={50}
          className="w-full max-w-[150px] object-cover"
        />
      </div>
    </>
  );
};

export default DynamicWaterMark;
