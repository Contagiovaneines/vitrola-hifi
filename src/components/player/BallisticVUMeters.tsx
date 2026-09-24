import React from 'react';

interface BallisticVUMetersProps {
  leftDb?: number;   // -40 dB a +3 dB
  rightDb?: number;  // -40 dB a +3 dB
  isLive?: boolean;
}

export const BallisticVUMeters: React.FC<BallisticVUMetersProps> = ({
  leftDb = -20,
  rightDb = -20,
  isLive = false
}) => {
  const clamp = (val: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, val));
  };

  // Converte dB (-20dB a +3dB) em ângulo de rotação (-28° a +18°)
  const dbToAngle = (db: number): number => {
    if (db <= -24) return -26;
    if (db >= 3) return 18;
    // Interpolação linear suave
    // -20 dB -> -22 deg
    // 0 dB   -> 0 deg
    // +3 dB  -> +16 deg
    const raw = db <= 0 ? -22 + ((db + 20) / 20) * 22 : (db / 3) * 16;
    return clamp(raw, -26, 18);
  };

  const angleL = isLive ? dbToAngle(leftDb) : -26;
  const angleR = isLive ? dbToAngle(rightDb) : -26;

  return (
    <div className="w-full rounded-xl bg-surface-container-lowest p-space-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.95),0_8px_20px_rgba(0,0,0,0.7)] border border-outline-variant/30 select-none">
      {/* VU Header */}
      <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20 mb-space-sm">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isLive
                ? 'bg-secondary shadow-[0_0_8px_#ffb95f]'
                : 'bg-outline-variant'
            }`}
          ></span>
          <span className="font-headline text-[9px] text-secondary tracking-widest uppercase font-bold">
            BALLISTIC VU METERS
          </span>
        </div>
        <span className="font-mono text-[9px] text-outline tracking-wider">
          PEAK BALLISTICS / 300ms
        </span>
      </div>

      {/* Dual Gauges Grid */}
      <div className="grid grid-cols-2 gap-space-md">
        {/* LEFT CHANNEL VU METER */}
        <div className="relative w-full aspect-[4/3] rounded-lg bg-gradient-to-b from-[#2d1f11] via-[#21160a] to-[#140e06] p-space-sm shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_0_15px_rgba(255,185,95,0.12)] flex flex-col justify-between overflow-hidden border border-outline-variant/20">
          <div className="flex items-center justify-between text-[9px] font-mono text-primary-fixed/80">
            <span className="font-bold">CH 1 · LEFT</span>
            <span className="text-error font-bold">+3dB MAX</span>
          </div>

          {/* Graphic Arc Gauge */}
          <div className="relative w-full h-16 sm:h-20 flex items-center justify-center">
            <svg
              className="w-full h-full text-outline-variant overflow-visible"
              viewBox="0 0 160 80"
              aria-label="Medidor VU Canal Esquerdo"
            >
              {/* Scale Arc Normal */}
              <path
                d="M 20 75 A 65 65 0 0 1 140 75"
                fill="none"
                stroke="currentColor"
                strokeDasharray="2,4"
                strokeWidth="1.5"
              />
              {/* Overload Arc (Red) */}
              <path
                d="M 115 25 A 65 65 0 0 1 140 75"
                fill="none"
                stroke="#ffb4ab"
                strokeWidth="2.5"
              />
              {/* Calibration Labels */}
              <text fill="#d4c4b5" fontFamily="Space Mono" fontSize="8" x="24" y="68">-20</text>
              <text fill="#d4c4b5" fontFamily="Space Mono" fontSize="8" x="45" y="44">-10</text>
              <text fill="#fec486" fontFamily="Space Mono" fontSize="8" x="75" y="32">-3</text>
              <text fill="#fec486" fontFamily="Space Mono" fontSize="8" x="100" y="32">0</text>
              <text fill="#ffb4ab" fontFamily="Space Mono" fontSize="8" x="126" y="44">+3</text>

              {/* Physical Needle Left */}
              <g style={{ transform: `rotate(${angleL}deg)`, transformOrigin: '80px 80px', transition: 'transform 100ms ease-out' }}>
                <line
                  stroke="#ffb95f"
                  strokeLinecap="round"
                  strokeWidth="2"
                  x1="80"
                  y1="80"
                  x2="80"
                  y2="18"
                />
              </g>
              <circle cx="80" cy="80" r="5" fill="#3c3836" stroke="#9d8e81" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-primary">
            <span className="text-outline-variant text-[8px]">RMS</span>
            <span>{isLive ? `${leftDb.toFixed(1)} VU` : 'OFF'}</span>
          </div>
        </div>

        {/* RIGHT CHANNEL VU METER */}
        <div className="relative w-full aspect-[4/3] rounded-lg bg-gradient-to-b from-[#2d1f11] via-[#21160a] to-[#140e06] p-space-sm shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_0_15px_rgba(255,185,95,0.12)] flex flex-col justify-between overflow-hidden border border-outline-variant/20">
          <div className="flex items-center justify-between text-[9px] font-mono text-primary-fixed/80">
            <span className="font-bold">CH 2 · RIGHT</span>
            <span className="text-error font-bold">+3dB MAX</span>
          </div>

          {/* Graphic Arc Gauge */}
          <div className="relative w-full h-16 sm:h-20 flex items-center justify-center">
            <svg
              className="w-full h-full text-outline-variant overflow-visible"
              viewBox="0 0 160 80"
              aria-label="Medidor VU Canal Direito"
            >
              <path
                d="M 20 75 A 65 65 0 0 1 140 75"
                fill="none"
                stroke="currentColor"
                strokeDasharray="2,4"
                strokeWidth="1.5"
              />
              <path
                d="M 115 25 A 65 65 0 0 1 140 75"
                fill="none"
                stroke="#ffb4ab"
                strokeWidth="2.5"
              />
              <text fill="#d4c4b5" fontFamily="Space Mono" fontSize="8" x="24" y="68">-20</text>
              <text fill="#d4c4b5" fontFamily="Space Mono" fontSize="8" x="45" y="44">-10</text>
              <text fill="#fec486" fontFamily="Space Mono" fontSize="8" x="75" y="32">-3</text>
              <text fill="#fec486" fontFamily="Space Mono" fontSize="8" x="100" y="32">0</text>
              <text fill="#ffb4ab" fontFamily="Space Mono" fontSize="8" x="126" y="44">+3</text>

              {/* Physical Needle Right */}
              <g style={{ transform: `rotate(${angleR}deg)`, transformOrigin: '80px 80px', transition: 'transform 100ms ease-out' }}>
                <line
                  stroke="#ffb95f"
                  strokeLinecap="round"
                  strokeWidth="2"
                  x1="80"
                  y1="80"
                  x2="80"
                  y2="18"
                />
              </g>
              <circle cx="80" cy="80" r="5" fill="#3c3836" stroke="#9d8e81" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-primary">
            <span className="text-outline-variant text-[8px]">RMS</span>
            <span>{isLive ? `${rightDb.toFixed(1)} VU` : 'OFF'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
