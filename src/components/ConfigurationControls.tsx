import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Compass,
  Palette,
  Camera,
  Sun,
  Sliders,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Box,
} from 'lucide-react';
import {
  GenerationSettings,
  ProductType,
  ProductOrientation,
  BackgroundStyle,
  SurfaceStyle,
  PropsStyle,
  AspectRatio,
  PhotographyTheme,
  ProductPosition,
  ProductPresentation,
  ShotType,
  CameraAngle,
  CameraPerspective,
  FocalLengthCharacter,
  DepthOfField,
  CompositionStyle,
  NegativeSpaceDirection,
  LightingStyle,
  ShadowCharacter,
  PropLevel,
  PropFamily,
  PropPlacement,
  ColorPalette,
  VariationLevel,
  imagePromptTemplates,
} from '../types';

interface ConfigurationControlsProps {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
  onGenerate: () => void;
  hasImage: boolean;
}

export const ConfigurationControls: React.FC<ConfigurationControlsProps> = ({
  settings,
  onChange,
  onGenerate,
  hasImage,
}) => {
  // Collapsible section state for progressive disclosure
  const [openSection, setOpenSection] = useState<
    'product' | 'camera' | 'environment' | 'lighting' | 'props' | 'variation' | 'output'
  >('product');

  const toggleSection = (
    section: 'product' | 'camera' | 'environment' | 'lighting' | 'props' | 'variation' | 'output'
  ) => {
    setOpenSection(openSection === section ? 'product' : section);
  };

  const updateSetting = <K extends keyof GenerationSettings>(
    key: K,
    value: GenerationSettings[K]
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const handleResetDefaults = () => {
    onChange({
      productType: 'notebook',
      orientation: 'flat-lay',
      background: 'gradient-wall-neutral-surface',
      surface: 'editorial-tabletop',
      props: 'subtle-historical',
      aspectRatio: '1:1',
      additionalInstructions: '',
      theme: 'editorial-still-life',
      productPosition: 'centered',
      productPresentation: 'editorial',
      shotType: 'hero-product',
      cameraAngle: 'three-quarter',
      perspective: 'natural',
      focalLength: 'normal-editorial',
      depthOfField: 'gentle-falloff',
      compositionStyle: 'centered',
      negativeSpace: 'balanced',
      lightingStyle: 'large-soft-studio',
      shadowCharacter: 'soft',
      propLevel: 'minimal',
      propFamily: 'category-aware',
      propPlacement: 'background-only',
      colorPalette: 'science-blue-mint',
      variationLevel: 'moderate',
    });
  };

  // Option lists
  const productTypes: { id: ProductType; label: string; icon: string }[] = [
    { id: 'mug', label: 'Mug', icon: '☕' },
    { id: 'tshirt', label: 'T-shirt', icon: '👕' },
    { id: 'hoodie', label: 'Hoodie', icon: '🧥' },
    { id: 'notebook', label: 'Notebook', icon: '📓' },
    { id: 'glass', label: 'Glass', icon: '🥛' },
    { id: 'waterBottle', label: 'Water bottle', icon: '🧴' },
    { id: 'tumbler', label: 'Tumbler', icon: '🥤' },
    { id: 'poster', label: 'Poster', icon: '🖼️' },
    { id: 'other', label: 'Other', icon: '✨' },
  ];

  const themes: { id: PhotographyTheme; label: string; desc: string }[] = [
    { id: 'clean-catalog', label: 'Clean Catalog', desc: 'Pristine e-commerce clarity' },
    { id: 'editorial-still-life', label: 'Editorial Still Life', desc: 'Magazine-worthy tactile storytelling' },
    { id: 'quiet-luxury', label: 'Quiet Luxury', desc: 'Understated, refined boutique restraint' },
    { id: 'intellectual', label: 'Intellectual & Scholarly', desc: 'Historical depth & science curiosity' },
    { id: 'scientific', label: 'Scientific Precision', desc: 'Luminous laboratory-grade clarity' },
    { id: 'archival', label: 'Archival & Vintage', desc: 'Warm museum-grade paper & brass patina' },
    { id: 'contemporary', label: 'Contemporary Minimal', desc: 'Architectural geometry & spatial poise' },
    { id: 'warm-minimal', label: 'Warm Minimal', desc: 'Inviting natural light & organic stone' },
    { id: 'sophisticated-dark', label: 'Sophisticated Dark', desc: 'Velvety shadows & sculpted key light' },
  ];

  const orientations: { id: ProductOrientation; label: string; desc: string }[] = [
    { id: 'upright', label: 'Upright', desc: 'Eye-level / hero standing view' },
    { id: 'folded', label: 'Folded', desc: 'Neat retail fold & drape' },
    { id: 'flat-lay', label: 'Flat-lay', desc: 'Direct 90° top-down layout' },
    { id: 'naturally-arranged', label: 'Naturally arranged', desc: 'Organic, relaxed editorial posture' },
  ];

  const shotTypes: { id: ShotType; label: string }[] = [
    { id: 'hero-product', label: 'Hero Product Shot' },
    { id: 'standard-catalog', label: 'Standard Catalog' },
    { id: 'editorial-still-life', label: 'Editorial Still Life' },
    { id: 'detail-oriented', label: 'Detail & Texture Focus' },
    { id: 'environmental-product', label: 'Environmental Studio' },
    { id: 'close-product-portrait', label: 'Close Product Portrait' },
  ];

  const cameraAngles: { id: CameraAngle; label: string }[] = [
    { id: 'three-quarter', label: 'Three-Quarter (Classic)' },
    { id: 'straight-on', label: 'Straight-On (Eye Level)' },
    { id: 'slightly-elevated', label: 'Slightly Elevated (25°)' },
    { id: 'slightly-lowered', label: 'Slightly Lowered' },
    { id: 'high-three-quarter', label: 'High Three-Quarter (45°)' },
    { id: 'gentle-overhead', label: 'Gentle Overhead / Flat-Lay' },
    { id: 'near-eye-level', label: 'Surface Plane Eye-Level' },
    { id: 'natural-perspective', label: 'Natural Editorial Perspective' },
  ];

  const depthOfFields: { id: DepthOfField; label: string; desc: string }[] = [
    { id: 'gentle-falloff', label: 'Gentle Falloff (f/5.6)', desc: 'Sharp product with soft background' },
    { id: 'deep-clarity', label: 'Deep Clarity (f/8)', desc: 'Tack-sharp across full scene' },
    { id: 'moderate-depth', label: 'Moderate Depth (f/4.5)', desc: 'Subtle background blur' },
    { id: 'shallow-editorial', label: 'Shallow Focus (f/2.8)', desc: 'Silky bokeh background' },
  ];

  const compositionStyles: { id: CompositionStyle; label: string }[] = [
    { id: 'centered', label: 'Centered Hero' },
    { id: 'slightly-offset', label: 'Slightly Offset (Golden Ratio)' },
    { id: 'left-weighted', label: 'Left-Weighted' },
    { id: 'right-weighted', label: 'Right-Weighted' },
    { id: 'generous-negative-space', label: 'Expansive Negative Space' },
    { id: 'tight-crop', label: 'Tight Product Crop' },
    { id: 'asymmetric-editorial', label: 'Asymmetric Editorial' },
    { id: 'symmetrical', label: 'Formal Symmetrical' },
  ];

  const negativeSpaces: { id: NegativeSpaceDirection; label: string }[] = [
    { id: 'balanced', label: 'Balanced All Around' },
    { id: 'left', label: 'Open Space Left' },
    { id: 'right', label: 'Open Space Right' },
    { id: 'above', label: 'Open Space Above' },
    { id: 'below', label: 'Open Space Below' },
    { id: 'natural-adaptive', label: 'Adaptive Natural Space' },
  ];

  const backgrounds: { id: BackgroundStyle; label: string; desc: string; swatchClass: string }[] = [
    {
      id: 'science-gradient',
      label: 'Science of Gifts Gradient',
      desc: 'Soft blue-to-mint gradient studio backdrop with photographic transition',
      swatchClass: 'bg-gradient-to-br from-[#99BFF9] via-[#C3F3DF] to-[#E0F2FE] border-[#93c5fd]',
    },
    {
      id: 'gradient-wall-neutral-surface',
      label: 'Gradient Wall + Neutral Surface',
      desc: 'Blue/mint backwall with tangible neutral tabletop below',
      swatchClass: 'bg-gradient-to-b from-[#99BFF9] via-[#C3F3DF] to-[#e2e8f0] border-[#93c5fd]',
    },
    {
      id: 'blue-wall-neutral-surface',
      label: 'Blue Wall + Neutral Surface',
      desc: 'Soft muted powder blue backwall with neutral stone tabletop',
      swatchClass: 'bg-gradient-to-b from-[#bae6fd] to-[#e2e8f0] border-[#7dd3fc]',
    },
    {
      id: 'mint-wall-neutral-surface',
      label: 'Mint Wall + Neutral Surface',
      desc: 'Soft seafoam mint backwall with neutral physical surface',
      swatchClass: 'bg-gradient-to-b from-[#a7f3d0] to-[#e2e8f0] border-[#6ee7b7]',
    },
    {
      id: 'neutral-editorial',
      label: 'Neutral Editorial',
      desc: 'Light neutral studio environment with clean off-white tones',
      swatchClass: 'bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-[#cbd5e1]',
    },
    {
      id: 'warm-ivory',
      label: 'Warm Ivory Studio',
      desc: 'Pale alabaster & warm ivory matte background',
      swatchClass: 'bg-gradient-to-br from-[#fffdfa] to-[#fef3c7] border-[#fde68a]',
    },
    {
      id: 'branded-editorial-environment',
      label: 'Branded Architectural Environment',
      desc: 'Blue & mint palette woven subtly into real 3D studio depth',
      swatchClass: 'bg-gradient-to-br from-[#e0f2fe] via-[#f1f5f9] to-[#d1fae5] border-[#94a3b8]',
    },
    {
      id: 'dark-editorial',
      label: 'Dark Editorial Studio',
      desc: 'Sophisticated darker studio with sculpted key lighting',
      swatchClass: 'bg-gradient-to-br from-[#334155] to-[#0f172a] border-[#1e293b]',
    },
  ];

  const surfaces: { id: SurfaceStyle; label: string; desc: string }[] = [
    { id: 'editorial-tabletop', label: 'Editorial Tabletop', desc: 'Honed travertine slab or pale white oak' },
    { id: 'light-stone', label: 'Light Limestone', desc: 'Pale honed limestone with fine grain' },
    { id: 'light-wood', label: 'Light White Oak', desc: 'Smooth pale matte white oak wood' },
    { id: 'dark-matte', label: 'Dark Slate Surface', desc: 'Deep charcoal slate or dark stone' },
    { id: 'soft-fabric', label: 'Raw Draped Linen', desc: 'Heavyweight unbleached draped linen' },
    { id: 'paper-archival', label: 'Archival Cotton Paper', desc: '300 GSM cotton rag paper tooth' },
    { id: 'no-visible-surface', label: 'Floating Space', desc: 'Floating seamlessly in negative space' },
  ];

  const colorPalettes: { id: ColorPalette; label: string; swatchClass: string }[] = [
    { id: 'science-blue-mint', label: 'Science of Gifts Blue + Mint', swatchClass: 'from-[#99BFF9] to-[#C3F3DF]' },
    { id: 'powder-blue', label: 'Powder Blue Dominant', swatchClass: 'from-[#99BFF9] to-[#E0F2FE]' },
    { id: 'seafoam-mint', label: 'Seafoam Mint Dominant', swatchClass: 'from-[#C3F3DF] to-[#E0F2FE]' },
    { id: 'blue-ivory', label: 'Blue & Warm Ivory', swatchClass: 'from-[#99BFF9] to-[#FFFDFA]' },
    { id: 'mint-ivory', label: 'Mint & Warm Ivory', swatchClass: 'from-[#C3F3DF] to-[#FFFDFA]' },
    { id: 'neutral-editorial', label: 'Neutral Alabaster', swatchClass: 'from-[#F8FAFC] to-[#E2E8F0]' },
    { id: 'deep-editorial', label: 'Deep Editorial Slate', swatchClass: 'from-[#1B3D5F] to-[#0F172A]' },
  ];

  const lightingStyles: { id: LightingStyle; label: string; desc: string }[] = [
    { id: 'large-soft-studio', label: 'Large Soft Studio Light', desc: 'Diffused studio softbox key' },
    { id: 'soft-daylight', label: 'Soft Daylight', desc: 'Tranquil north-facing window light' },
    { id: 'gentle-window', label: 'Gentle Raking Window Light', desc: 'Side window lighting from upper-left' },
    { id: 'side-lit-editorial', label: 'Side-Lit Editorial', desc: 'Directional light across contours' },
    { id: 'sculpted-studio', label: 'Sculpted Studio Lighting', desc: 'Key softbox with subtle rim light' },
    { id: 'quiet-dramatic', label: 'Quiet Dramatic Lighting', desc: 'Velvety shadows & rich contrast' },
  ];

  const shadowCharacters: { id: ShadowCharacter; label: string }[] = [
    { id: 'very-soft', label: 'Whisper Soft Shadows' },
    { id: 'soft', label: 'Soft Natural Contact Shadows' },
    { id: 'moderate', label: 'Moderate Grounding Shadows' },
    { id: 'defined-natural', label: 'Defined Natural Base Shadows' },
  ];

  const propLevels: { id: PropLevel; label: string; desc: string }[] = [
    { id: 'none', label: 'None', desc: 'Pure hero product alone in space' },
    { id: 'single-accent', label: 'Single Accent', desc: 'One understated prop item' },
    { id: 'minimal', label: 'Minimal (1–2 props)', desc: 'Restrained, curated accents' },
    { id: 'sparse', label: 'Sparse', desc: 'Quiet background presence' },
    { id: 'small-curated-grouping', label: 'Small Curated Grouping', desc: '2–3 storytelling items' },
  ];

  const propFamilies: { id: PropFamily; label: string }[] = [
    { id: 'category-aware', label: 'Category-Aware (Smart Match)' },
    { id: 'historical-archival', label: 'Historical & Archival (Brass caliper, chart fragment)' },
    { id: 'scientific', label: 'Scientific (Glass prism, geometric block)' },
    { id: 'writing-desk', label: 'Writing & Desk (Fountain pen, deckle paper)' },
    { id: 'film-cinema', label: 'Film & Optics (Lens element, archival film)' },
    { id: 'literary', label: 'Literary (Cloth-bound book, bookmark)' },
    { id: 'natural-botanical', label: 'Natural & Botanical (Eucalyptus, dried leaf)' },
    { id: 'architectural', label: 'Architectural (Travertine block, pedestal)' },
    { id: 'neutral-decorative', label: 'Neutral Studio Accents' },
  ];

  const propPlacements: { id: PropPlacement; label: string }[] = [
    { id: 'background-only', label: 'Soft Background Only (f/4 blur)' },
    { id: 'beside-product', label: 'Beside Hero Product' },
    { id: 'foreground-accent', label: 'Foreground Accent (Corner)' },
    { id: 'asymmetric', label: 'Asymmetric Balance' },
    { id: 'adaptive', label: 'Adaptive Natural Layout' },
  ];

  const variationLevels: { id: VariationLevel; label: string; desc: string }[] = [
    { id: 'consistent', label: 'Consistent', desc: 'Minimal variation between prompt generations' },
    { id: 'subtle', label: 'Subtle', desc: 'Gentle shifts in camera angle & light highlights' },
    { id: 'moderate', label: 'Moderate (Recommended)', desc: 'Balanced creative variation in props, angle & gradient' },
    { id: 'strong', label: 'Strong', desc: 'Dynamic shifts in composition, viewpoint & prop styling' },
  ];

  const aspectRatios: { id: AspectRatio; label: string; ratioDesc: string; shapeClass: string }[] = [
    { id: '1:1', label: '1:1', ratioDesc: 'Square / E-commerce', shapeClass: 'w-5 h-5' },
    { id: '4:5', label: '4:5', ratioDesc: 'Editorial Portrait', shapeClass: 'w-4 h-5' },
    { id: '3:2', label: '3:2', ratioDesc: 'Classic Catalog', shapeClass: 'w-6 h-4' },
    { id: '16:9', label: '16:9', ratioDesc: 'Widescreen Banner', shapeClass: 'w-7 h-4' },
  ];

  return (
    <div className="space-y-4 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
      {/* Header & Preset Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0f172a]">
              Editorial Photography Studio
            </h2>
            <p className="text-[11px] text-[#64748b]">
              Controlled creative direction with non-deterministic prompt variation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#475569] hover:text-[#0284c7] bg-[#f8fafc] hover:bg-[#f0f9ff] border border-[#cbd5e1] rounded-lg transition-all cursor-pointer"
          title="Reset to Science of Gifts Editorial Baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Progressive Disclosure Section Switcher */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
        {[
          { id: 'product', label: '1. Product & Theme', icon: <Box className="w-3.5 h-3.5" /> },
          { id: 'camera', label: '2. Camera & View', icon: <Camera className="w-3.5 h-3.5" /> },
          { id: 'environment', label: '3. Environment & Color', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'lighting', label: '4. Lighting', icon: <Sun className="w-3.5 h-3.5" /> },
          { id: 'props', label: '5. Props & Styling', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'variation', label: '6. Variation', icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: 'output', label: '7. Ratio & Notes', icon: <FileText className="w-3.5 h-3.5" /> },
        ].map((sec) => {
          const isActive = openSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setOpenSection(sec.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#0284c7] shadow-xs border border-[#bae6fd] ring-1 ring-[#0284c7]/20'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white/60'
              }`}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==========================================
          SECTION 1: PRODUCT & THEME
         ========================================== */}
      {openSection === 'product' && (
        <div className="space-y-5 pt-2">
          {/* Product Type Grid */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#0284c7] text-[11px] font-bold flex items-center justify-center">1</span>
                Product Type
              </span>
              <span className="text-[11px] text-[#64748b]">Select product category</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {productTypes.map((item) => {
                const isSelected = settings.productType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateSetting('productType', item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] text-[#0369a1] font-semibold ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#334155]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {settings.productType === 'other' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Specify custom product: e.g. Brass bookmark, enamel pin, canvas tote..."
                  value={settings.customProductType || ''}
                  onChange={(e) => updateSetting('customProductType', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>
            )}

            {/* Dynamic Editorial Guidance Badge */}
            <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-2 text-[11px] text-[#475569]">
              <Info className="w-3.5 h-3.5 text-[#0284c7] mt-0.5 flex-shrink-0" />
              <span>
                {imagePromptTemplates[settings.productType]?.uiGuidance ||
                  imagePromptTemplates.other.uiGuidance}
              </span>
            </div>
          </div>

          {/* Product Orientation */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Compass className="w-3.5 h-3.5 text-[#0284c7]" />
              Product Orientation & Staging
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {orientations.map((item) => {
                const isSelected = settings.orientation === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateSetting('orientation', item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* High-Level Theme / Art Direction */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              High-Level Art Direction & Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {themes.map((th) => {
                const isSelected = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => updateSetting('theme', th.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {th.label}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5 truncate">
                      {th.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SECTION 2: CAMERA & VIEWPOINT
         ========================================== */}
      {openSection === 'camera' && (
        <div className="space-y-5 pt-2">
          {/* Shot Type */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Camera className="w-3.5 h-3.5 text-[#0284c7]" />
              Shot Type & Framing
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {shotTypes.map((st) => {
                const isSelected = (settings.shotType || 'hero-product') === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => updateSetting('shotType', st.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] text-[#0369a1] font-bold ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#334155]'
                    }`}
                  >
                    <span className="text-xs">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Camera Angle */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Compass className="w-3.5 h-3.5 text-[#0284c7]" />
              Camera Angle (Bounded Variation Enabled)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cameraAngles.map((ca) => {
                const isSelected = (settings.cameraAngle || 'three-quarter') === ca.id;
                return (
                  <button
                    key={ca.id}
                    type="button"
                    onClick={() => updateSetting('cameraAngle', ca.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] text-[#0369a1] font-bold ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#334155]'
                    }`}
                  >
                    <span className="text-xs">{ca.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Depth of Field */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-[#0284c7]" />
              Depth of Field
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {depthOfFields.map((dof) => {
                const isSelected = (settings.depthOfField || 'gentle-falloff') === dof.id;
                return (
                  <button
                    key={dof.id}
                    type="button"
                    onClick={() => updateSetting('depthOfField', dof.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {dof.label}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                      {dof.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Composition Alignment & Negative Space */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2 block">
                Composition Style
              </label>
              <select
                value={settings.compositionStyle || 'centered'}
                onChange={(e) => updateSetting('compositionStyle', e.target.value as CompositionStyle)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] bg-white text-[#1e293b]"
              >
                {compositionStyles.map((cs) => (
                  <option key={cs.id} value={cs.id}>
                    {cs.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2 block">
                Negative Space Direction
              </label>
              <select
                value={settings.negativeSpace || 'balanced'}
                onChange={(e) => updateSetting('negativeSpace', e.target.value as NegativeSpaceDirection)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] bg-white text-[#1e293b]"
              >
                {negativeSpaces.map((ns) => (
                  <option key={ns.id} value={ns.id}>
                    {ns.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SECTION 3: ENVIRONMENT & COLOR
         ========================================== */}
      {openSection === 'environment' && (
        <div className="space-y-5 pt-2">
          {/* Background Style */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#0284c7]" />
                Background & Environment Setting
              </span>
            </label>

            <div className="space-y-2">
              {backgrounds.map((bg) => {
                const isSelected = settings.background === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => updateSetting('background', bg.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg border flex-shrink-0 shadow-xs ${bg.swatchClass}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                        {bg.label}
                      </p>
                      <p className="text-[10px] text-[#64748b] mt-0.5 truncate">
                        {bg.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Surface */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2 block">
              Physical Staging Surface
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {surfaces.map((s) => {
                const isSelected = settings.surface === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateSetting('surface', s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                      {s.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Color Palette */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2 block">
              Curated Editorial Color Palette
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {colorPalettes.map((cp) => {
                const isSelected = (settings.colorPalette || 'science-blue-mint') === cp.id;
                return (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => updateSetting('colorPalette', cp.id)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${cp.swatchClass} flex-shrink-0 border border-[#cbd5e1]`} />
                    <span className={`text-xs font-semibold truncate ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {cp.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-[#64748b] mt-1.5">
              * Note: Color palette strictly influences studio backdrop, props & atmospheric bounces. Never alters product artwork or product colors.
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          SECTION 4: LIGHTING & SHADOWS
         ========================================== */}
      {openSection === 'lighting' && (
        <div className="space-y-5 pt-2">
          {/* Lighting Style */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sun className="w-3.5 h-3.5 text-[#0284c7]" />
              Studio Lighting Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lightingStyles.map((ls) => {
                const isSelected = (settings.lightingStyle || 'large-soft-studio') === ls.id;
                return (
                  <button
                    key={ls.id}
                    type="button"
                    onClick={() => updateSetting('lightingStyle', ls.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {ls.label}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                      {ls.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shadow Character */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2 block">
              Contact Shadow Character
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {shadowCharacters.map((sc) => {
                const isSelected = (settings.shadowCharacter || 'soft') === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => updateSetting('shadowCharacter', sc.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] text-[#0369a1] font-bold ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#334155]'
                    }`}
                  >
                    <span className="text-xs">{sc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SECTION 5: STYLING & PROPS
         ========================================== */}
      {openSection === 'props' && (
        <div className="space-y-5 pt-2">
          {/* Prop Level */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              Prop Quantity & Density
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {propLevels.map((pl) => {
                const isSelected = (settings.propLevel || (settings.props === 'none' ? 'none' : 'minimal')) === pl.id;
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => {
                      updateSetting('propLevel', pl.id);
                      if (pl.id === 'none') updateSetting('props', 'none');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {pl.label}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                      {pl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prop Family */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2 block">
              Curated Prop Family
            </label>
            <select
              value={settings.propFamily || 'category-aware'}
              onChange={(e) => updateSetting('propFamily', e.target.value as PropFamily)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] bg-white text-[#1e293b]"
            >
              {propFamilies.map((pf) => (
                <option key={pf.id} value={pf.id}>
                  {pf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prop Placement */}
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-2 block">
              Prop Spatial Placement
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {propPlacements.map((pp) => {
                const isSelected = (settings.propPlacement || 'background-only') === pp.id;
                return (
                  <button
                    key={pp.id}
                    type="button"
                    onClick={() => updateSetting('propPlacement', pp.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] text-[#0369a1] font-bold ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#334155]'
                    }`}
                  >
                    <span className="text-xs">{pp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SECTION 6: CONTROLLED VARIATION
         ========================================== */}
      {openSection === 'variation' && (
        <div className="space-y-5 pt-2">
          <div>
            <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5 text-[#0284c7]" />
              Controlled Prompt Variation Level
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {variationLevels.map((vl) => {
                const isSelected = (settings.variationLevel || 'moderate') === vl.id;
                return (
                  <button
                    key={vl.id}
                    type="button"
                    onClick={() => updateSetting('variationLevel', vl.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {vl.label}
                    </p>
                    <p className="text-[10px] text-[#64748b] mt-0.5 leading-tight">
                      {vl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] space-y-2 text-xs text-[#0369a1]">
            <div className="flex items-center gap-2 font-bold text-[#0284c7]">
              <CheckCircle2 className="w-4 h-4 text-[#0284c7]" />
              <span>How Bounded Variation Works</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#334155]">
              Your UI choices remain completely stable and deterministic. The generated prompt explicitly distinguishes between <strong>FIXED CONSTRAINTS</strong> (exact product artwork, typography & shape) and <strong>VARIABLE CREATIVE ELEMENTS</strong> (micro-angle, prop placement, shadow shape, gradient transition direction). Multiple image generations from this prompt will look like part of the same campaign while introducing subtle, professional variety.
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          SECTION 7: FRAMING & NOTES
         ========================================== */}
      {openSection === 'output' && (
        <div className="space-y-5 pt-2">
          {/* Aspect Ratio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0284c7]" />
                Aspect Ratio
              </label>
              <span className="text-[11px] text-[#64748b]">Composition framing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {aspectRatios.map((item) => {
                const isSelected = settings.aspectRatio === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateSetting('aspectRatio', item.id)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                    }`}
                  >
                    <div
                      className={`border-2 rounded-xs transition-colors ${
                        isSelected ? 'border-[#0284c7] bg-[#bae6fd]' : 'border-[#94a3b8] bg-[#f1f5f9]'
                      } ${item.shapeClass}`}
                    />
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#0369a1]' : 'text-[#1e293b]'}`}>
                      {item.label}
                    </span>
                    <span className="text-[9px] text-[#64748b] leading-none">
                      {item.ratioDesc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0284c7]" />
                Additional User Notes / Free-Text Directives
              </label>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. Focus sharply on the gold foil title, subtle evening raking light from top-left, emphasize the ribbed collar texture..."
              value={settings.additionalInstructions}
              onChange={(e) => updateSetting('additionalInstructions', e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-[#cbd5e1] focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] resize-y text-[#1e293b] placeholder-[#94a3b8]"
            />
          </div>
        </div>
      )}

      {/* Large Generate Prompt Button */}
      <div className="pt-2 border-t border-[#f1f5f9]">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full py-4 px-6 rounded-xl font-medium text-white shadow-md transition-all flex items-center justify-center gap-2.5 text-base bg-gradient-to-r from-[#0284c7] via-[#0f766e] to-[#0d9488] hover:from-[#0369a1] hover:to-[#0f766e] hover:shadow-lg active:scale-[0.99] cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-[#fed7aa]" />
          <span className="font-semibold tracking-wide">Generate Creative Photography Prompt</span>
        </button>

        <p className="text-center text-[11px] text-[#64748b] mt-2">
          100% client-side • Instant generation from Science of Gifts editorial photography templates
        </p>
      </div>
    </div>
  );
};
