import React from 'react';

interface PreampKnobsProps {
  bassDb: number;
  onBassChange: (val: number) => void;
  trebleDb: number;
  onTrebleChange: (val: number) => void;
  tubeDrive: number;
  onTubeDriveChange: (val: number) => void;
  volume: number; // 0 a 100
  onVolumeChange: (val: number) => void;
}

export const PreampKnobs: React.FC<PreampKnobsProps> = ({
  bassDb,
  onBassChange,
  trebleDb,
  onTrebleChange,
  tubeDrive,
  onTubeDriveChange,
  volume,
  onVolumeChange,
}) => {
  // Converte valor em rotação (-135° a +135°)
  const valToDeg = (val: number, min: number, max: number): number => {
    const norm = (val - min) / (max - min);
    return -135 + norm * 270;
  };

  const handleWheel = (
    e: React.WheelEvent,
    val: number,
    min: number,
    max: number,
    step: number,
    setter: (n: number) => void
  ) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? step : -step;
    setter(Math.max(min, Math.min(max, Math.round((val + delta) * 10) / 10)));
  };

  return (
    <div className="w-full rounded-xl bg-surface-container-low p-space-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] border border-outline-variant/30 select-none">
      {/* Title */}
      <div className="flex items-center justify-between pb-space-xs mb-space-md border-b border-outline-variant/20">
        <span className="font-headline text-[9px] text-outline uppercase tracking-wider font-bold">
          TONE &amp; PREAMP STAGE
        </span>
        <span className="font-mono text-[10px] text-secondary font-bold">
          RIAA EQ: ACTIVE
        </span>
      </div>

      {/* 4 Knobs Grid */}
      <div className="grid grid-cols-4 gap-space-xs sm:gap-space-sm text-center">
        {/* BASS KNOB */}
        <div
          className="flex flex-col items-center gap-1 cursor-pointer group"
          onWheel={(e) => handleWheel(e, bassDb, -12, 12, 1, onBassChange)}
          title="Gire a roda do mouse para ajustar os Graves"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#3b342e] via-[#6a6055] to-[#26211c] shadow-[0_6px_14px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,221,187,0.3)] flex items-center justify-center border border-outline-variant/40">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-lowest shadow-inner flex items-center justify-center">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-primary-fixed to-outline-variant relative transition-transform duration-75"
                style={{ transform: `rotate(${valToDeg(bassDb, -12, 12)}deg)` }}
              >
                <div className="w-1 h-3 rounded-full bg-surface-container-lowest absolute top-0.5 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          <span className="font-headline text-[10px] text-on-surface font-bold uppercase mt-1">
            Graves
          </span>
          <span className="font-mono text-[10px] text-primary">
            {bassDb > 0 ? `+${bassDb.toFixed(1)}` : bassDb.toFixed(1)} dB
          </span>
        </div>

        {/* TREBLE KNOB */}
        <div
          className="flex flex-col items-center gap-1 cursor-pointer group"
          onWheel={(e) => handleWheel(e, trebleDb, -12, 12, 1, onTrebleChange)}
          title="Gire a roda do mouse para ajustar os Agudos"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#3b342e] via-[#6a6055] to-[#26211c] shadow-[0_6px_14px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,221,187,0.3)] flex items-center justify-center border border-outline-variant/40">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-lowest shadow-inner flex items-center justify-center">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-primary-fixed to-outline-variant relative transition-transform duration-75"
                style={{ transform: `rotate(${valToDeg(trebleDb, -12, 12)}deg)` }}
              >
                <div className="w-1 h-3 rounded-full bg-surface-container-lowest absolute top-0.5 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          <span className="font-headline text-[10px] text-on-surface font-bold uppercase mt-1">
            Agudos
          </span>
          <span className="font-mono text-[10px] text-primary">
            {trebleDb > 0 ? `+${trebleDb.toFixed(1)}` : trebleDb.toFixed(1)} dB
          </span>
        </div>

        {/* TUBE DRIVE KNOB */}
        <div
          className="flex flex-col items-center gap-1 cursor-pointer group"
          onWheel={(e) => handleWheel(e, tubeDrive, 0, 10, 0.5, onTubeDriveChange)}
          title="Gire a roda do mouse para ajustar a Saturação Valvular"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#523315] via-[#a86a2f] to-[#341e07] shadow-[0_6px_14px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,221,187,0.4)] flex items-center justify-center border border-secondary/40">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-lowest shadow-inner flex items-center justify-center">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-secondary to-primary-container relative transition-transform duration-75"
                style={{ transform: `rotate(${valToDeg(tubeDrive, 0, 10)}deg)` }}
              >
                <div className="w-1 h-3 rounded-full bg-surface-container-lowest absolute top-0.5 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          <span className="font-headline text-[10px] text-secondary font-bold uppercase mt-1">
            Tubo Sat
          </span>
          <span className="font-mono text-[10px] text-secondary">
            +{tubeDrive.toFixed(1)} dB
          </span>
        </div>

        {/* VOLUME KNOB */}
        <div
          className="flex flex-col items-center gap-1 cursor-pointer group"
          onWheel={(e) => handleWheel(e, volume, 0, 100, 5, onVolumeChange)}
          title="Gire a roda do mouse para ajustar o Volume"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#3b342e] via-[#6a6055] to-[#26211c] shadow-[0_6px_14px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,221,187,0.3)] flex items-center justify-center border border-outline-variant/40">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-lowest shadow-inner flex items-center justify-center">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-primary-fixed to-outline-variant relative transition-transform duration-75"
                style={{ transform: `rotate(${valToDeg(volume, 0, 100)}deg)` }}
              >
                <div className="w-1 h-3 rounded-full bg-surface-container-lowest absolute top-0.5 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          <span className="font-headline text-[10px] text-on-surface font-bold uppercase mt-1">
            Volume
          </span>
          <span className="font-mono text-[10px] text-primary font-bold">
            {Math.round(volume)}%
          </span>
        </div>
      </div>
    </div>
  );
};
