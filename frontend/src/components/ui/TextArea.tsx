import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxChar?: number;
  currentLength?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, maxChar, currentLength, className = "", ...props }, ref) => {
    const isNearLimit =
      maxChar && currentLength && currentLength > maxChar * 0.9;
    const isOverLimit = maxChar && currentLength && currentLength > maxChar;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-temp-secondary text-sm font-medium mb-2">
            {label}
            {maxChar && (
              <span className="text-temp-secondary/70 ml-2">
                ({currentLength || 0}/{maxChar})
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            className={`
            w-full px-4 py-3
            bg-temp-dark/50
            border ${error ? "border-red-500" : "border-gray-700"} 
            rounded-lg
            text-temp-text
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-temp-primary/50 focus:border-temp-primary
            transition-all duration-200
            resize-y min-h-30
            ${isOverLimit ? "ring-2 ring-red-500/20" : ""}
            ${className}
          `}
            {...props}
          />

          {maxChar && (
            <div className="absolute bottom-2 right-2">
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
                {currentLength || 0}/{maxChar}
              </span>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
