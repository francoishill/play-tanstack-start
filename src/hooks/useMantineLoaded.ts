import { useEffect, useState } from "react";

/**
 * Hook that detects when Mantine styles are fully loaded
 * by checking for the presence of Mantine CSS custom properties
 */
export function useMantineLoaded(): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMantineStyles = () => {
      if (typeof window === "undefined") {
        return false;
      }

      try {
        // Check for Mantine CSS custom properties on the document element
        const documentStyle = window.getComputedStyle(document.documentElement);
        
        // Mantine sets CSS custom properties like --mantine-color-white, --mantine-spacing-xs, etc.
        const hasMantineVars = 
          documentStyle.getPropertyValue("--mantine-color-white") !== "" ||
          documentStyle.getPropertyValue("--mantine-spacing-xs") !== "" ||
          documentStyle.getPropertyValue("--mantine-color-blue-6") !== "";

        if (hasMantineVars) {
          return true;
        }

        // Fallback: Check if a Mantine component class has expected styles
        const testElement = document.createElement("div");
        testElement.className = "mantine-Button-root";
        testElement.style.position = "absolute";
        testElement.style.visibility = "hidden";
        testElement.style.pointerEvents = "none";
        
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        
        // Check for typical Mantine button styles
        const hasButtonStyles = 
          computedStyle.display === "inline-flex" ||
          computedStyle.cursor === "pointer" ||
          computedStyle.fontFamily.includes("system-ui") ||
          computedStyle.fontSize !== "" && computedStyle.fontSize !== "16px"; // Default browser font size
        
        document.body.removeChild(testElement);
        
        return hasButtonStyles;
      } catch (error) {
        console.warn("Error checking Mantine styles:", error);
        return false;
      }
    };    // Check immediately
    if (checkMantineStyles()) {
      setIsLoaded(true);
      return;
    }

    // If not loaded yet, set up observers
    let rafId: number;
    let timeoutId: NodeJS.Timeout;

    const pollForStyles = () => {
      if (checkMantineStyles()) {
        setIsLoaded(true);
      } else {
        rafId = requestAnimationFrame(pollForStyles);
      }
    };

    // Start polling
    rafId = requestAnimationFrame(pollForStyles);

    // Fallback timeout to prevent infinite loading (max 2 seconds)
    timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    // Cleanup function
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return isLoaded;
}
