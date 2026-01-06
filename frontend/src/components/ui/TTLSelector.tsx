import { useState } from "react";
import RangeSlider from "./RangeSlider";
import NumberInput from "./NumberInput";
import { formatDetailed } from "@/libs/time";

interface TTLSelectorProps {
  value: number;
  onChange: (minutes: number) => void;
  className?: string;
}

export default function TTLSelector({
  value,
  onChange,
  className = "",
}: TTLSelectorProps) {
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const presets = [
    { label: "1 мин", value: 1, color: "from-blue-400 to-cyan-400" },
    { label: "5 мин", value: 5, color: "from-cyan-400 to-teal-400" },
    { label: "15 мин", value: 15, color: "from-teal-400 to-emerald-400" },
    { label: "1 час", value: 60, color: "from-emerald-400 to-green-400" },
    { label: "24 часа", value: 1440, color: "from-green-400 to-lime-400" },
  ];

  const handlePresetClick = (presetValue: number) => {
    onChange(presetValue);
    setActivePreset(presetValue);
    setTimeout(() => setActivePreset(null), 300);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <label className="block text-temp-secondary text-sm font-medium">
          Время жизни заметки
        </label>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-linear-to-r from-temp-primary to-temp-secondary bg-clip-text text-transparent">
            {formatDetailed(value)}
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm text-temp-text/70 mb-3">Быстрый выбор</div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const isActive =
              value === preset.value || activePreset === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={`
                  px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? `bg-linear-to-r ${preset.color} text-temp-dark shadow-lg scale-105`
                      : "bg-temp-dark/50 text-temp-text/80 hover:text-temp-primary hover:bg-temp-dark/70 border border-gray-700"
                  }
                `}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-temp-primary/10">
        <div className="flex items-center justify-between">
          <NumberInput
            value={value}
            onChange={onChange}
            min={1}
            max={1440}
            step={5}
            unit="мин"
          />
        </div>

        <div className="space-y-3">
          <RangeSlider
            min={1}
            max={1440}
            value={value}
            onChange={onChange}
            step={5}
          />
          <div className="flex justify-between text-xs text-temp-secondary/70">
            <span>1 мин</span>
            <span>12 ч</span>
            <span>24 ч</span>
          </div>
        </div>
      </div>
    </div>
  );
}
