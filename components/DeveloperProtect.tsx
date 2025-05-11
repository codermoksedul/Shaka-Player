"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeveloperProtect() {
  const router = useRouter();
  useEffect(() => {
    // 1. Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Detect devtools opening (optional, no redirect)
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        console.log("Developer tools are not allowed.");
        router.push("/");
      }
    };

    // 3. Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);

    const devToolsCheckInterval = setInterval(checkDevTools, 500);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      clearInterval(devToolsCheckInterval);
    };
  }, []);

  return null;
}
