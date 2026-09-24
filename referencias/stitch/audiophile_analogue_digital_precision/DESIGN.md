---
name: Audiophile Analogue-Digital Precision
colors:
  surface: '#161311'
  surface-dim: '#161311'
  surface-bright: '#3c3836'
  surface-container-lowest: '#100e0c'
  surface-container-low: '#1e1b19'
  surface-container: '#221f1d'
  surface-container-high: '#2d2927'
  surface-container-highest: '#383432'
  on-surface: '#e9e1dd'
  on-surface-variant: '#d4c4b5'
  inverse-surface: '#e9e1dd'
  inverse-on-surface: '#33302d'
  outline: '#9d8e81'
  outline-variant: '#50453a'
  surface-tint: '#f5bc7e'
  primary: '#fec486'
  on-primary: '#482900'
  primary-container: '#e0a96d'
  on-primary-container: '#633d09'
  inverse-primary: '#805521'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffc2a7'
  on-tertiary: '#571e00'
  tertiary-container: '#ff9a6b'
  on-tertiary-container: '#7a2d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddbb'
  primary-fixed-dim: '#f5bc7e'
  on-primary-fixed: '#2b1700'
  on-primary-fixed-variant: '#653e0b'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb595'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#161311'
  on-background: '#e9e1dd'
  surface-variant: '#383432'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Syne
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-meter:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-technical:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-hardware:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-compact: 0.5rem
  gutter-loose: 1.5rem
  margin: 1.5rem
  margin-window: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system pairs the tactile materiality of bespoke 1970s mid-century hi-fi equipment—oiled walnut, turned brass, knurled copper, and acoustic grille cloth—with the uncompromised precision of modern digital audio workstations. Tailored specifically for the dedicated Windows desktop environment, it caters to critical listeners, vinyl enthusiasts, and high-fidelity collectors who value physical ceremony alongside millisecond-accurate DSP performance.

The aesthetic philosophy is **Tactile Skeuomorphic Modernism**. Rather than ornamental pastiche, physical affordances serve explicit functional ergonomics: rotary pots feature fine-toothed knurling for granular parameter control; mechanical toggle switches yield unmistakable state clarity; glowing vacuum tubes and amber filament LEDs communicate metering and power rails. Flat digital surfaces are reserved for dense metadata arrays, playlist hierarchies, and lossless bitstream status, providing a restrained, modern anchor against the rich physical chassis.

## Colors
The palette evokes an intimately lit listening lounge wrapped in walnut and patinated metals. Surfaces are never sterile black; they derive from deep charcoal espresso tones that simulate an acoustic equipment bay.

- **Primary (`#E0A96D` - Brushed Brass):** Represents mechanical precision and primary structural controls. Used for dominant knobs, active track highlights, high-resolution audio badges, and primary action affordances.
- **Secondary (`#F59E0B` - Filament Amber):** Simulates the internal glow of incandescent panel lamps and vacuum tubes. Used strictly for illuminated states, playback progress heads, VU meter peaks, and live audio transport flags.
- **Tertiary (`#C86432` - Burnished Copper):** Anchors secondary hardware components, accent switches, recording/mute tallies, and analog saturation stage indicators.
- **Neutral Baseline (`#1A1715` - Deep Walnut Espresso):** Foundation tone representing instrument-grade cabinetry. Supported by `#121110` (chassis recess/shadows) and `#24201D` (elevated control bay decks).
- **Text & Readout Accents:** Primary legibility relies on `#F5EBE1` (Warm Bone Cream) for crisp display readability against dark woods, while `#D8C7B5` (Muted Linen) handles secondary metadata, bitrates, and hardware labeling.

## Typography
The typographic architecture strikes a calculated contrast between structural audio hardware faceplates and modern high-resolution audio displays.

- **Syne** delivers sculptural, architectural presence to hero track titles, album titles, and physical deck modes, mirroring the craftsmanship of bespoke industrial engineering.
- **Plus Jakarta Sans** serves as the utilitarian workhorse for dense directory trees, artist bios, playlists, and settings dialogue, preserving clear legibility at dark surface contrast ratios.
- **Space Mono** acts as the digital readout matrix. Used exclusively for digital timecodes, bit depth/sample rates (e.g., `24-bit / 192kHz FLAC`), frequency readouts (`Hz/kHz`), and dynamic decibel (`dBFS`) monitoring.
- All structural faceplate hardware text labels (`label-hardware`) are set in uppercase with deliberate letter-spacing (`0.15em`) to evoke stamped or laser-etched brushed brass faceplates.

## Layout & Spacing
The layout model is anchored to a dual-pane asymmetric desktop console grid engineered for 16:9 and ultrawide Windows environments.

- **Layout Grid:** A 16-column flexible audio console layout. The primary physical turntable and tone-arm engine occupies a dedicated 6-to-7 column rack bay, while the playback queue, digital spectrum analyzer, and file library balance the remaining columns.
- **Window Architecture:** Optimized for Windows 11 framing. Incorporates an integrated custom 32px chrome header housing custom micro-machined brass minimize, maximize, and close controls alongside discrete ASIO/WASAPI driver status tokens.
- **Layout Rhythms:** Internal control bays maintain tight spatial discipline (`space-sm` to `space-md`) to emulate condensed master control panels. High-level separation between audio engine modules and list environments uses `space-xl` to prevent visual clutter and misclicks during live parameter adjustments.

## Elevation & Depth
Elevation is achieved through tactile skeumorphism and physical material mechanics rather than generic blur shadows. Surfaces convey clear depth and haptic qualities through distinct tiers:

- **Level 0 (The Walnut Plinth):** The master ground plane. Rendered with subtle grain depth, ambient occlusion, and an inner border mimicking a solid wood cabinet recess (`inset 0 1px 1px rgba(255,255,255,0.05), inset 0 20px 40px rgba(0,0,0,0.8)`).
- **Level 1 (Sub-Chassis Metal Decking):** Recessed or surface-mounted brushed brass and copper plates. Boundaries feature a dual-edge physical chamfer: a top 1px edge highlight (`#E0A96D` at 25% opacity) and a bottom 1px deep shadow edge (`#000000` at 90% opacity).
- **Level 2 (Active Hardware Dials & Switches):** Knurled brass knobs and rotary stepped pots. Rendered using conical metallic gradients combined with sharp directional drop shadows (`0 8px 16px -2px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)`), conveying a tangible lift from the faceplate.
- **Level 3 (Acoustic Vinyl Platter & Glass Bay):** The vinyl surface features micro-groove refraction (repeating radial micro-gradients) protected by an optional tinted acrylic dustcover overlay utilizing subtle dual specular reflections along the top-right vector.
- **Illumination Layer (Warm Filament Glow):** Amber indicator LEDs and analog backlights generate diffuse volumetric illumination (`box-shadow: 0 0 12px #F59E0B, 0 0 2px #FFF`).

## Shapes
A conservative roundedness value of `1` (0.25rem / 4px baseline) is strictly maintained for digital UI containers, faceplates, and parameter panels, reflecting the crisp, machined fabrication of precision chassis.

- **Chassis Panels & Modules:** Modest 4px radiused corners denote solid metallic blocks and flush-mounted modular inserts.
- **Hardware Affordances:** Dials, knobs, mechanical toggles, and spindle assemblies are strictly circular (geometric 100% radius), preserving true industrial tooling silhouettes.
- **Vinyl Grooves & Platters:** Perfect concentric circles with microscopic geometric steps.
- **Status Pills:** Selected filters and bitstream tags use a 2px micro-chamfer rather than broad round pills, aligning with stamped military/industrial audio standards.

## Components

### Hardware Rotary Dials (Volume, Pitch & Tone)
- **Visuals:** Radial brushed brass face with diamond knurling pattern around the perimeter. Top surface features an engraved indicator notch filled with warm cream enamel.
- **States:** Hover displays a faint golden rim illumination. Dragging smoothly increments values accompanied by a subtle Space Mono readout tooltip; continuous drag offers micro-stepping with Shift key down.

### Mechanical Toggle Switches (EQ, Power, Motor Run)
- **Visuals:** Heavy bat-style copper or nickel toggle lever seated in a recessed threaded hexagonal nut base.
- **States:** Up (Active) exposes an internal amber glowing bezel slit underneath the lever; Down (Bypass/Off) silences the illumination and drops the lever into deep casting shadow.

### Buttons & Transport Controls
- **Primary Transport (Play/Pause, Cue):** Heavy square brass push-buttons with a defined 2px mechanical travel distance. In resting state, they sit elevated via a sharp drop shadow; when pressed or engaged, they seat flush with the deck with an illuminated amber LED center pip.
- **Secondary Actions:** Dark anodized aluminum keys with laser-etched cream iconography.

### Chips & Audio Badges
- **Visuals:** Machined metal plates displaying sample rate, bit depth, or format (`DSD256`, `FLAC 192/24`). Bordered by a 1px brass keyline with monospaced center type.
- **Variants:** Lossless/Hi-Res badges trigger a permanent subtle filament glow at the perimeter.

### Lists & Track Table
- **Visuals:** Clean, utilitarian dark espresso rows with hairline brass-tinted separators (`rgba(224, 169, 109, 0.08)`).
- **Row States:** Active playing track reveals a 3px vertical copper indicator bar on the left edge, shifting track title text to `#E0A96D`. Hover subtly shifts background tone to `#24201D`.
- **Columns:** Rigidly aligned monospaced track numbers and timecodes juxtaposed with modern sans-serif titles.

### Checkboxes & Radio Controls
- **Visuals:** Miniature mechanical slide switches and recessed circular selector studs with center-point amber LED illumination when checked, avoiding flat modern ticks.

### Input Fields & Search
- **Visuals:** Dark inset slots with an engraved inner shadow (`inset 0 2px 4px rgba(0,0,0,0.6)`), styled like frequency tuning indicators.
- **States:** Active focus ignites a precision 1px amber border and illuminates a warm needle caret.

### Cards & Vinyl Sleeves
- **Visuals:** Rigid album display cards designed like heavy cardboard LP jackets, complete with realistic spine drop shadows and edge wear highlights. Hover initiates a gentle 8px slide-out revealing the grooved vinyl disc within.