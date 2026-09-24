import React from 'react';
import { ThemePreset } from '../types';
import { Palette, Check, Sliders, Sun, Thermometer, Laptop, Pin } from 'lucide-react';

interface CustomizationViewProps {
  currentTheme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
  selectedWood: string;
  onWoodChange: (wood: string) => void;
  selectedMetal: string;
  onMetalChange: (metal: string) => void;
  selectedCloth: string;
  onClothChange: (cloth: string) => void;
  armLampBrightness: number;
  onArmLampChange: (val: number) => void;
  colorTempK: number;
  onColorTempChange: (val: number) => void;
  isVuBacklightOn: boolean;
  onVuBacklightToggle: () => void;
  onLaunchMiniWidget?: () => void;
}

export const CustomizationView: React.FC<CustomizationViewProps> = ({
  currentTheme,
  onThemeChange,
  selectedWood,
  onWoodChange,
  selectedMetal,
  onMetalChange,
  selectedCloth,
  onClothChange,
  armLampBrightness,
  onArmLampChange,
  colorTempK,
  onColorTempChange,
  isVuBacklightOn,
  onVuBacklightToggle,
  onLaunchMiniWidget,
}) => {
  const masterThemes: {
    id: ThemePreset;
    title: string;
    subtitle: string;
    description: string;
    palette: string[];
    tag: string;
  }[] = [
    {
      id: 'classica',
      title: 'Madeira Clássica',
      subtitle: 'Nostalgia 1974',
      description:
        'Jacarandá nobre avermelhado, ferragens em latão torneado, sarja bege tweed e iluminação quente âmbar 2700K.',
      palette: ['#78350f', '#fec486', '#cfc3ab'],
      tag: 'Padrão Hi-Fi',
    },
    {
      id: 'pretodourado',
      title: 'Preto & Ouro 24K',
      subtitle: 'Concerto Royale',
      description:
        'Ebanizado piano black fosco, detalhes nobres folheados a ouro 24k, disco fumê espelhado e trama carbono.',
      palette: ['#000000', '#ffd700', '#262626'],
      tag: 'Exclusivo',
    },
    {
      id: 'neonmoderno',
      title: 'Neon Moderno',
      subtitle: 'Cyber Audiophile',
      description:
        'Chassis mineral grafite jateado, alumínio usinado, iluminação periférica ciano elétrico e magenta neon.',
      palette: ['#18181b', '#00f0ff', '#ff007f'],
      tag: 'Estúdio Pro',
    },
  ];

  const woods = [
    { id: 'mogno', name: 'Mogno Imperial', color: '#78350f' },
    { id: 'carvalho', name: 'Carvalho Escuro', color: '#3d271d' },
    { id: 'nogueira', name: 'Nogueira Walnut', color: '#56382d' },
    { id: 'bambu', name: 'Bambu Tratado', color: '#a38053' },
  ];

  const metals = [
    { id: 'latao', name: 'Latão Escovado', color: '#e0a96d' },
    { id: 'cobre', name: 'Cobre Polido', color: '#c86432' },
    { id: 'cromo', name: 'Cromo Fumê', color: '#94a3b8' },
    { id: 'ouro', name: 'Ouro 24K', color: '#ffd700' },
  ];

  const cloths = [
    { id: 'tweed', name: 'Sarja Tweed Vintage', color: '#cfc3ab', badge: 'PADRÃO' },
    { id: 'dourada', name: 'Malha Metálica Dourada', color: '#9c7d42', badge: 'ALTA RIGIDEZ' },
    { id: 'charcoal', name: 'Tecido Charcoal Pro', color: '#1f1d1c', badge: 'ESTÚDIO' },
  ];

  return (
    <div className="flex flex-col w-full pb-space-xl select-none">
      {/* Sub-header Breadcrumb */}
      <div className="flex items-center justify-between py-space-sm mb-space-md border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-outline uppercase tracking-widest">
            Ateliê Acústico
          </span>
          <span className="text-outline-variant">/</span>
          <span className="font-display text-lg text-primary font-bold">
            Personalização &amp; Mini Widget
          </span>
          <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-mono text-[9px] font-bold">
            CHASSIS STUDIO v2.4
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 xl:grid-cols-16 gap-space-lg items-start">
        {/* Left Column: Themes & Material Lab (10 cols on xl) */}
        <div className="col-span-12 xl:col-span-10 flex flex-col gap-space-lg">
          {/* Master Themes Factory Presets */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-headline text-[9px] text-outline uppercase tracking-widest font-bold">
                  Estéticas Curadas
                </span>
                <h3 className="font-display text-lg text-on-surface font-bold">
                  Temas Mestres de Fábrica
                </h3>
              </div>
              <span className="font-mono text-xs text-on-surface-variant hidden sm:inline">
                Selecione uma base acústica para calibração
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {masterThemes.map((theme) => {
                const isActive = currentTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={`cursor-pointer p-space-md rounded-xl transition-all duration-300 relative border flex flex-col justify-between ${
                      isActive
                        ? 'bg-surface-container-high border-primary shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_12px_rgba(254,196,134,0.3)]'
                        : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_#ffb95f]"></div>
                    )}

                    <div>
                      <div className="flex items-center gap-space-sm mb-space-sm">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shadow-inner border border-outline-variant/30">
                          <Palette size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display text-sm text-primary font-bold">
                            {theme.title}
                          </span>
                          <span className="font-mono text-[10px] text-outline">
                            {theme.subtitle}
                          </span>
                        </div>
                      </div>

                      <p className="font-headline text-xs text-on-surface-variant mb-space-md leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20">
                      <div className="flex items-center gap-1.5">
                        {theme.palette.map((col, idx) => (
                          <span
                            key={idx}
                            className="w-4 h-4 rounded-full border border-outline-variant/40"
                            style={{ backgroundColor: col }}
                          ></span>
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-secondary uppercase font-semibold">
                        {theme.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Granular Physical Textures Laboratory */}
          <div className="p-space-lg rounded-xl bg-surface-container-low shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <span className="font-display text-sm text-primary font-bold">
                Laboratório de Texturas Físicas &amp; Hardware
              </span>
              <span className="font-mono text-[10px] text-outline font-bold">
                AJUSTES MANUAIS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* 1. Woods */}
              <div className="flex flex-col gap-2">
                <span className="font-headline text-[10px] text-outline uppercase font-bold tracking-wider">
                  1. Madeira do Gabinete
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {woods.map((w) => {
                    const isW = selectedWood === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => onWoodChange(w.id)}
                        className={`flex items-center gap-2 p-2 rounded text-left transition-all border ${
                          isW
                            ? 'bg-surface-container-high border-primary/50 text-on-surface shadow-sm'
                            : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-outline-variant/30"
                          style={{ backgroundColor: w.color }}
                        ></span>
                        <span className="font-headline text-xs truncate">
                          {w.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Metals */}
              <div className="flex flex-col gap-2">
                <span className="font-headline text-[10px] text-outline uppercase font-bold tracking-wider">
                  2. Acabamento dos Metais
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {metals.map((m) => {
                    const isM = selectedMetal === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => onMetalChange(m.id)}
                        className={`flex items-center gap-2 p-2 rounded text-left transition-all border ${
                          isM
                            ? 'bg-surface-container-high border-primary/50 text-on-surface shadow-sm'
                            : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-outline-variant/30"
                          style={{ backgroundColor: m.color }}
                        ></span>
                        <span className="font-headline text-xs truncate">
                          {m.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Grille Fabric */}
              <div className="flex flex-col gap-2">
                <span className="font-headline text-[10px] text-outline uppercase font-bold tracking-wider">
                  3. Tecido da Grelha
                </span>
                <div className="flex flex-col gap-1.5">
                  {cloths.map((c) => {
                    const isC = selectedCloth === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => onClothChange(c.id)}
                        className={`flex items-center justify-between p-2 rounded transition-all border ${
                          isC
                            ? 'bg-surface-container-high border-primary/50 text-on-surface shadow-sm'
                            : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-3.5 h-3.5 rounded shrink-0 border border-outline-variant/30"
                            style={{ backgroundColor: c.color }}
                          ></span>
                          <span className="font-headline text-xs truncate">
                            {c.name}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-secondary font-bold">
                          {c.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lighting Controls */}
            <div className="mt-space-sm pt-space-md border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-3 gap-space-lg items-center">
              {/* Arm Lamp Brightness */}
              <div className="flex items-center justify-between gap-space-md bg-surface-container-highest/40 p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-headline text-[9px] text-outline uppercase tracking-wider font-bold">
                    Luz do Braço Tonearm
                  </span>
                  <span className="font-mono text-sm text-primary font-bold">
                    {armLampBrightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={armLampBrightness}
                  onChange={(e) => onArmLampChange(Number(e.target.value))}
                  className="w-24 accent-primary cursor-pointer"
                />
              </div>

              {/* Filament Color Temp */}
              <div className="flex items-center justify-between gap-space-md bg-surface-container-highest/40 p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-headline text-[9px] text-outline uppercase tracking-wider font-bold">
                    Temperatura Filamento
                  </span>
                  <span className="font-mono text-xs text-secondary font-bold">
                    {colorTempK}K (Âmbar)
                  </span>
                </div>
                <input
                  type="range"
                  min="2200"
                  max="4000"
                  step="100"
                  value={colorTempK}
                  onChange={(e) => onColorTempChange(Number(e.target.value))}
                  className="w-24 accent-secondary cursor-pointer"
                />
              </div>

              {/* VU Backlight Toggle */}
              <div className="flex items-center justify-between gap-space-md bg-surface-container-highest/40 p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-headline text-[9px] text-outline uppercase tracking-wider font-bold">
                    Iluminação VU Meter
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    Lâmpadas Incandescentes
                  </span>
                </div>
                <button
                  onClick={onVuBacklightToggle}
                  className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all ${
                    isVuBacklightOn
                      ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                      : 'bg-surface-container-lowest text-outline border border-outline-variant/30'
                  }`}
                >
                  {isVuBacklightOn ? 'LIGADO' : 'DESLIGADO'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Windows Desktop Mini Widget Configuration & Preview (6 cols on xl) */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-space-lg">
          <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
            <div>
              <span className="font-headline text-[9px] text-outline uppercase tracking-widest font-bold">
                Windows 11 Gadget
              </span>
              <h3 className="font-display text-lg text-on-surface font-bold">
                Mini Widget Flutuante
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[9px] text-primary font-bold border border-outline-variant/30">
              WASAPI Direct
            </span>
          </div>

          {/* Desktop Preview Frame */}
          <div className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.85)] border border-outline-variant/30 flex flex-col justify-between p-space-md bg-gradient-to-br from-[#1c1917] via-[#0d0c0b] to-[#161311]">
            {/* Desktop Simulation Header */}
            <div className="flex items-center justify-between text-on-surface/70 font-mono text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/70"></span>
                <span>Área de Trabalho Windows (Preview)</span>
              </div>
              <span>1920 × 1080</span>
            </div>

            {/* The Floating Mini Widget Mockup */}
            <div className="self-center w-full max-w-[340px] p-space-sm rounded-xl bg-surface-container-lowest/90 backdrop-blur-xl border border-primary/30 shadow-[0_12px_32px_rgba(0,0,0,0.8)] flex flex-col gap-space-xs">
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
                <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">
                  VITROLA MINI DECK
                </span>
                <div className="flex items-center gap-1 text-outline">
                  <Pin size={12} className="text-secondary" />
                </div>
              </div>

              {/* Core Audio Row */}
              <div className="flex items-center gap-3 py-1">
                {/* Mini Spinning Vinyl */}
                <div className="w-12 h-12 rounded-full bg-[#0d0c0b] vinyl-grooves-pattern flex items-center justify-center shrink-0 border border-primary/30 animate-vinyl-33">
                  <div className="w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-[6px] font-bold text-on-secondary-container">
                    VT
                  </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-display text-xs text-primary font-bold truncate">
                    Vitrola Mini Deck
                  </span>
                  <span className="font-headline text-[10px] text-on-surface-variant truncate">
                    Controles de Desktop &bull; WASAPI
                  </span>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full mt-1.5 overflow-hidden">
                    <div className="w-2/5 h-full bg-primary shadow-[0_0_8px_#fec486]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="flex items-center justify-between font-mono text-[9px] text-outline">
              <span>Fixado sempre no topo</span>
              <span>Arrastável com botão esquerdo</span>
            </div>
          </div>

          {/* Launch Widget Button */}
          <button
            onClick={onLaunchMiniWidget}
            className="w-full py-3 px-space-md rounded-lg bg-secondary text-on-secondary font-headline text-sm font-bold shadow-[0_4px_14px_rgba(255,185,95,0.3)] hover:bg-secondary-fixed transition-all flex items-center justify-center gap-2"
          >
            <Laptop size={18} />
            <span>Destacar Widget no Desktop Windows</span>
          </button>
        </div>
      </div>
    </div>
  );
};
