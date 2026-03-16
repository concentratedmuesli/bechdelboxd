import { useState, useEffect } from "react";
import orangeDiamond from "/img/orange-bullet-point.svg"
import blueDiamond from "/img/blue-bullet-point.svg"
import greenDiamond from "/img/green-bullet-point.svg"

export function Loading() {

  const flipImages = [
    orangeDiamond,
    blueDiamond,
    greenDiamond
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flipImages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [flipImages.length]);

  return (
    <div className="h-screen flex justify-center items-center">
      <style>{`
        @keyframes flipDiamond {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        .animate-flipDiamond {
           animation: flipDiamond 1s ease-in-out infinite;
          transform-style: preserve-3d;
        }
      `}</style>
      <img className="animate-flipDiamond"
        src={flipImages[currentIndex]}
      />
    </div>
  );
}