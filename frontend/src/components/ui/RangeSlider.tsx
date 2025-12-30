import React, { useState, useRef, useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  className?: string;
}

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 5,
  className = "",
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const formatTimeLabel = (minutes: number) => {
    if (minutes < 60) return `${minutes}м`;
    if (minutes === 60) return "1ч";
    if (minutes === 1440) return "24ч";
    return `${Math.floor(minutes / 60)}ч`;
  };

  const calculateValueFromClientX = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return value;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percent = (x / rect.width) * 100;
      const rawValue = min + (percent / 100) * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;

      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step, value],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const element = sliderRef.current;
    if (!element) return;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      const newValue = calculateValueFromClientX(moveEvent.clientX);
      onChange(newValue);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      element.removeEventListener(
        "pointermove",
        handlePointerMove as EventListener,
      );
      element.removeEventListener(
        "pointerup",
        handlePointerUp as EventListener,
      );
      element.removeEventListener(
        "pointercancel",
        handlePointerUp as EventListener,
      );
      element.releasePointerCapture((e as any).pointerId);
    };

    element.addEventListener("pointermove", handlePointerMove as EventListener);
    element.addEventListener("pointerup", handlePointerUp as EventListener);
    element.addEventListener("pointercancel", handlePointerUp as EventListener);
    element.setPointerCapture((e as any).pointerId);

    const newValue = calculateValueFromClientX(e.clientX);
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        ref={sliderRef}
        className="relative h-10 cursor-pointer select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => setIsHovering(false)}
      >
        <div className="absolute top-1/2 left-0 right-0 h-2.5 -translate-y-1/2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-linear-to-r from-temp-primary via-temp-secondary to-temp-primary animate-gradient bg-size-[200%] rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-3 border-temp-dark cursor-grab active:cursor-grabbing z-10 transition-all duration-150 ${
            isDragging ? "scale-125 shadow-lg shadow-temp-primary/40" : ""
          } ${isHovering ? "scale-110" : ""}`}
          style={{ left: `${percentage}%` }}
        >
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-temp-primary to-temp-secondary" />

          <div className="absolute inset-1 rounded-full bg-temp-dark" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-temp-primary to-temp-secondary" />
          </div>
        </div>

        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-temp-dark border border-temp-primary/30 rounded-lg text-xs font-medium text-temp-primary whitespace-nowrap transition-opacity duration-200 ${
            isDragging || isHovering ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: `${percentage}%` }}
        >
          {formatTimeLabel(value)}
        </div>
      </div>
    </div>
  );
}
