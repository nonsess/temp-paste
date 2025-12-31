import React, { useState, useEffect, useRef } from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  type?: "text" | "password" | "email";
  disabled?: boolean;
  error?: string;
  label?: string;
}

export default function TextInput({
  value,
  onChange,
  minLength,
  maxLength,
  placeholder = "",
  className = "",
  type = "text",
  disabled = false,
  error,
  label,
}: TextInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    if (maxLength && inputValue.length > maxLength) {
      const trimmedValue = inputValue.substring(0, maxLength);
      setInputValue(trimmedValue);
      onChange(trimmedValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  const characterCount = inputValue.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.9;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-temp-secondary text-sm font-medium mb-2">
          {label}
          {maxLength && (
            <span className="text-temp-secondary/70 ml-2">
              ({characterCount}/{maxLength})
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3
            bg-temp-dark/50
            border ${error ? "border-red-500" : "border-gray-700"} 
            ${isOverLimit ? "border-yellow-500" : ""}
            rounded-lg
            text-temp-text
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-temp-primary/50 focus:border-temp-primary
            transition-all duration-200
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
        />

        {maxLength && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <span
              className={`
                text-xs px-2 py-1 rounded
                ${
                  isOverLimit
                    ? "bg-red-500/20 text-red-400"
                    : isNearLimit
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-temp-dark text-temp-secondary/70"
                }
              `}
            >
              {characterCount}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      
      {minLength && characterCount > 0 && characterCount < minLength && (
        <p className="mt-1 text-sm text-yellow-400">
          Минимум {minLength} символов
        </p>
      )}
    </div>
  );
}