'use client';

import React, { useEffect, useState } from 'react';

/**
 * WavingIndianFlag
 * Renders a full-viewport, fixed-position waving tricolor flag using vertical slices.
 * This ensures saffron, white, and green stripes are always joined perfectly,
 * waving together in unison like a real fabric flag in the wind.
 */
export default function WavingIndianFlag() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const totalSlices = 40;

  return (
    <>
      <style>{`
        .india-flag-bg {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          display: flex;
          overflow: hidden;
          opacity: 0.12; /* Subtle opacity so it does not disturb the form readability */
        }

        .flag-slice {
          height: 100%;
          flex: 1;
          background-image: url(/indian-flag.png);
          background-size: 100vw 100vh;
          background-repeat: no-repeat;
          margin-right: -1px; /* Overlap slices to prevent subpixel vertical gaps */
          transform-origin: center center;
          animation: flag-wave-slice 3.5s ease-in-out infinite;
        }

        @keyframes flag-wave-slice {
          0%, 100% {
            transform: translateY(-12px) scaleY(1.02);
            filter: brightness(0.85) contrast(1.1);
          }
          50% {
            transform: translateY(12px) scaleY(0.98);
            filter: brightness(1.15) contrast(0.9);
          }
        }
      `}</style>

      <div className="india-flag-bg" aria-hidden="true">
        {[...Array(totalSlices)].map((_, i) => (
          <div
            key={i}
            className="flag-slice"
            style={{
              backgroundPosition: `calc(-${i} * (100vw / ${totalSlices})) 0px`,
              animationDelay: `calc(${i} * -0.08s)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
