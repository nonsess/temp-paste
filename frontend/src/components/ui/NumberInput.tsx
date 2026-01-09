import React, { useState, useEffect, useRef } from "react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  unit?: string;
  className?: string;
}

export default function NumberInput({
  value,
  onChange,
  min = 1,
  max = 1440,
  step = 5,
  placeholder = "60",
  unit = "мин",
  className = "",
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const numericValue = newValue.replace(/[^\d]/g, "");
    setInputValue(numericValue);

    if (numericValue) {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(min, Math.min(max, numValue));
        onChange(clampedValue);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (!inputValue.trim()) {
      setInputValue(value.toString());
      return;
    }

    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue)) {
      setInputValue(value.toString());
    } else {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      setInputValue(clampedValue.toString());
      onChange(clampedValue);
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    } else if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="relative flex items-center bg-temp-dark/30 border border-gray-700 rounded-xl hover:border-temp-primary/50 focus-within:border-temp-primary focus-within:ring-2 focus-within:ring-temp-primary/20 transition-all duration-200">
        <button
          type="button"
          onClick={handleDecrement}
          onMouseDown={(e) => e.preventDefault()}
          disabled={value <= min}
          className="p-3 cursor-pointer text-temp-secondary hover:text-temp-primary hover:bg-temp-dark/50 disabled:text-gray-500 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors rounded-l-xl"
          aria-label="Уменьшить"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-700" />

        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={isFocused ? inputValue : value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full py-3 px-4 bg-transparent text-temp-text text-center text-lg font-medium focus:outline-none placeholder:text-temp-secondary/40"
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-temp-secondary/60 text-sm font-medium">
              {unit}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-700" />

        <button
          type="button"
          onClick={handleIncrement}
          onMouseDown={(e) => e.preventDefault()}
          disabled={value >= max}
          className="p-3 cursor-pointer text-temp-secondary hover:text-temp-primary hover:bg-temp-dark/50 disabled:text-gray-500 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors rounded-r-xl"
          aria-label="Увеличить"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-between mt-1.5 px-1">
        <span className="text-xs text-temp-secondary/50">мин: {min}</span>
        <span className="text-xs text-temp-secondary/50">макс: {max}</span>
      </div>
    </div>
  );
}
