"use client";

import { useEffect } from "react";

export default function SnowflakeEffect() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .snowflake {
        color: rgba(255, 255, 255, 0.9); /* Slightly brighter snowflakes */
        font-size: 1.5em; /* Larger base size */
        font-family: Arial, sans-serif;

        position: fixed;
        top: -10%;
        z-index: 9999;
        pointer-events: none;
        animation: fall linear infinite, twinkle ease-in-out infinite;
      }
      
      @keyframes fall {
        0% { transform: translateY(0); }
        100% { transform: translateY(110vh); }
      }

      @keyframes twinkle {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.5; }
      }

      /* Randomize positions, delays, and sizes */
      .snowflake:nth-child(odd) { font-size: 1.8em; animation-duration: 8s; left: 5%; }
      .snowflake:nth-child(even) { font-size: 1.7em; animation-duration: 10s; left: 30%; }
      .snowflake:nth-child(3n) { font-size: 2.6em; animation-duration: 12s; left: 50%; }
      .snowflake:nth-child(4n) { font-size: 2.1em; animation-duration: 7s; left: 70%; }
      .snowflake:nth-child(5n) { font-size: 2.4em; animation-duration: 9s; left: 90%; }
    `;
    document.head.appendChild(style);

    const snowflakesContainer = document.createElement("div");
    snowflakesContainer.className = "snowflakes";
    snowflakesContainer.setAttribute("aria-hidden", "true");

    // Generate 30 snowflakes dynamically
    for (let i = 0; i < 30; i++) {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      snowflake.textContent = "❆"; // Snowflake icon
      snowflake.style.left = `${Math.random() * 100}vw`; // Random horizontal position
      snowflake.style.animationDelay = `${Math.random() * 5}s`; // Random delay
      snowflakesContainer.appendChild(snowflake);
    }

    document.body.appendChild(snowflakesContainer);

    // Cleanup on unmount
    return () => {
      snowflakesContainer.remove();
      style.remove();
    };
  }, []);

  return null;
}
