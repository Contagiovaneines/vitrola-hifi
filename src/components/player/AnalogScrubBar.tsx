import React from 'react';

interface AnalogScrubBarProps {
  currentTimeSec: number;
  durationSec: number;
  onSeek: (positionSec: number) => void;
  disabled?: boolean;
}

export const AnalogScrubBar: React.FC<AnalogScrubBarProps> = ({
  currentTimeSec,
  durationSec,
  onSeek,
  disabled = false
}) => {
  const formatTime = (secs: number): string => {
    if (!secs || isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const percentage = durationSec > 0 ? Math.min(100, Math.max(0, (currentTimeSec / durationSec) * 100)) : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || durationSec <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * durationSec);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || durationSec <= 0) return;
    const step = 5; // 5 segundos
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onSeek(Math.min(durationSec, currentTimeSec + step));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onSeek(Math.max(0, currentTimeSec - step));
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full select-none">
      {/* Heavy Brass Inset Scrub / Groove Progress Bar */}
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Posição de reprodução da faixa"
        aria-valuenow={Math.round(currentTimeSec)}
        aria-valuemin={0}
        aria-valuemax={Math.round(durationSec)}
        aria-valuetext={`${formatTime(currentTimeSec)} de ${formatTime(durationSec)}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`relative w-full h-4 bg-surface-container-lowest rounded-full p-0.5 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] border border-outline-variant/30 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary'
        }`}
      >
        {/* Groove Fill Track */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary to-primary shadow-[0_0_8px_#ffb95f] relative transition-[width] duration-100 ease-linear"
          style={{ width: `${percentage}%` }}
        >
          {/* Machined Mechanical Brass Needle Indicator */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-5 rounded-sm bg-gradient-to-b from-[#ffd79d] via-[#d69f5c] to-[#6c4819] shadow-[0_2px_6px_rgba(0,0,0,0.95)] flex items-center justify-center border border-[#ffddbb]/40">
            <div className="w-0.5 h-3 bg-surface-container-lowest"></div>
          </div>
        </div>
      </div>

      {/* Rigid High-Contrast Monospace Time Readout */}
      <div className="flex items-center justify-between font-mono text-xs text-outline font-bold px-0.5">
        <span className="text-primary-fixed">{formatTime(currentTimeSec)}</span>
        <span className="font-mono text-[9px] text-outline-variant tracking-wider uppercase hidden sm:inline">
          Groove Depth: 52µm
        </span>
        <span className="text-on-surface-variant">{formatTime(durationSec)}</span>
      </div>
    </div>
  );
};
