import {
  BackgroundStyle,
  SurfaceStyle,
  PropsStyle,
  AspectRatio,
  PromptOptions,
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
  VariationToggles,
} from '../types';

// ==========================================
// 1. Reference & Preservation Headers
// ==========================================
export function formatReferenceHeader(hasReferenceImage?: boolean, referenceImageName?: string): string {
  if (hasReferenceImage) {
    const filenameInfo = referenceImageName ? ` (${referenceImageName})` : '';
    return `[REFERENCE PRODUCT ATTACHED${filenameInfo}: Use the uploaded product image as the absolute, definitive source of truth for the physical object.]`;
  }
  return `[SOURCE OF TRUTH DIRECTIVE: Treat the reference product as the definitive standard for all design, typography, logos, and physical construction.]`;
}

export function getUniversalPreservationRules(): string {
  return `UNIVERSAL PRODUCT PRESERVATION MANDATE (FIXED CONSTRAINTS):
• PRODUCT SOURCE OF TRUTH: The physical hero product itself is the single most critical element in the photograph.
• ABSOLUTE GRAPHIC & ARTWORK FIDELITY: Faithfully preserve all actual product design, artwork, illustrations, typography, logos, foil stamping, debossing, and surface graphics exactly as shown in the reference. Do NOT redesign, recolor, reinterpret, replace, or distort any graphic elements.
• EXACT CONSTRUCTION & PHYSICAL DETAILS: Faithfully retain all authentic physical construction details—bookbinding spines, closures, ribbon markers, seam lines, collar ribbing, glass sham weight, handles, caps, bottle spouts, and material textures.
• ACCURATE PRODUCT COLORS & PROPORTIONS: Never alter the true physical colors of the product itself or distort its natural proportions.
• NO FABRICATED FEATURES: Never invent unrequested product features, logos, or accessories on the hero product itself.`;
}

// ==========================================
// 2. High-Level Creative Direction / Theme
// ==========================================
export function getThemePromptText(theme?: PhotographyTheme): string {
  switch (theme) {
    case 'clean-catalog':
      return 'Art Direction: Clean Catalog — High-clarity, pristine e-commerce presentation with crisp details, tranquil studio illumination, and unpretentious elegance.';
    case 'editorial-still-life':
      return 'Art Direction: Editorial Still Life — Magazine-worthy artistic arrangement featuring tactile material presence, gentle organic light falloff, and calm storytelling.';
    case 'quiet-luxury':
      return 'Art Direction: Quiet Luxury — Understated, high-end boutique aesthetic with restrained textures, soft raking light, generous negative space, and refined distinction.';
    case 'intellectual':
      return 'Art Direction: Intellectual & Thoughtful — Celebrates curiosity, craftsmanship, and historical or scientific depth with timeless, scholarly restraint.';
    case 'scientific':
      return 'Art Direction: Scientific & Precision — Clean, luminous, laboratory-inspired clarity highlighting geometry, optical precision, and pristine physical forms.';
    case 'archival':
      return 'Art Direction: Archival & Historical — Warm, timeless, museum-grade presentation with subtle tactile patina, soft natural light, and historical resonance.';
    case 'contemporary':
      return 'Art Direction: Contemporary Minimal — Modern, architectural, and graphics-forward with clean spatial geometry, soft contrast, and calm confidence.';
    case 'warm-minimal':
      return 'Art Direction: Warm Minimal — Inviting, tactile, and grounded with soft natural light, pale organic surfaces, and serene spatial harmony.';
    case 'sophisticated-dark':
      return 'Art Direction: Sophisticated Dark — Velvety dark background tones, sculpted studio key lighting, subtle rim illumination, and quiet dramatic presence.';
    case 'seasonal-editorial':
      return 'Art Direction: Seasonal Editorial — Subtle, atmospheric seasonal mood expressed through quiet organic textures and warm natural light.';
    case 'natural-editorial':
      return 'Art Direction: Natural Editorial — Soft north-facing window light, organic linen or stone surfaces, and effortless natural posture.';
    default:
      return 'Art Direction: Science of Gifts Editorial Studio — A refined, tranquil synthesis of quiet luxury, intellectual curiosity, and pristine e-commerce clarity.';
  }
}

// ==========================================
// 3. Camera & Angle (With Bounded Variation)
// ==========================================
export function getCameraPromptText(options: PromptOptions): string {
  const angle = options.cameraAngle || 'three-quarter';
  const shot = options.shotType || 'hero-product';
  const perspective = options.perspective || 'natural';
  const focal = options.focalLength || 'normal-editorial';
  const dof = options.depthOfField || 'gentle-falloff';

  let shotDesc = 'Hero product composition featuring complete, unobstructed product visibility.';
  switch (shot) {
    case 'standard-catalog':
      shotDesc = 'Standard high-clarity e-commerce catalog shot with balanced, clean product framing.';
      break;
    case 'editorial-still-life':
      shotDesc = 'Editorial still-life framing capturing the product naturally within its curated studio environment.';
      break;
    case 'detail-oriented':
      shotDesc = 'Detail-oriented product perspective highlighting fine craftsmanship, material weave, and tactile surface finish.';
      break;
    case 'environmental-product':
      shotDesc = 'Environmental product photograph capturing the hero item gracefully anchored within a spacious studio setting.';
      break;
    case 'close-product-portrait':
      shotDesc = 'Intimate product portrait framing focusing on the core aesthetic identity and frontal artwork.';
      break;
  }

  let angleDesc = 'Use a refined three-quarter perspective with a subtly elevated or naturally eye-level viewpoint appropriate to the product. Allow the precise viewing angle and micro-elevation to vary naturally between generations while preserving sharp product recognition and correct geometry.';
  switch (angle) {
    case 'straight-on':
      angleDesc = 'Use a straight-on eye-level angle with near-zero tilt. Allow subtle natural micro-variations in camera height and rotation between generations while maintaining a clean, authoritative frontal view.';
      break;
    case 'slightly-elevated':
      angleDesc = 'Use a gently elevated 20–30 degree camera viewpoint looking down towards the product. Allow small natural variations in elevation angle between generations while preserving clear product geometry.';
      break;
    case 'slightly-lowered':
      angleDesc = 'Use a slightly lowered camera perspective just below eye level to give the product subtle stature. Allow gentle micro-angle variations between generations.';
      break;
    case 'high-three-quarter':
      angleDesc = 'Use a high three-quarter angle (40–50 degrees elevation) revealing both top surface planes and side contours. Allow slight variations in camera position between generations.';
      break;
    case 'gentle-overhead':
      angleDesc = 'Use a gentle overhead to flat-lay perspective (75–90 degrees). Allow modest variations in product orientation and framing between generations.';
      break;
    case 'near-eye-level':
      angleDesc = 'Use a near eye-level perspective resting at surface plane height. Allow minor natural height shifts between generations.';
      break;
    case 'natural-perspective':
      angleDesc = 'Use a natural, unforced human perspective as if viewing the object on an editorial display table. Allow the exact camera angle and elevation to adapt naturally.';
      break;
  }

  let perspectiveDesc = 'Natural optical perspective with zero wide-angle distortion.';
  if (perspective === 'slightly-compressed') perspectiveDesc = 'Slightly compressed optical perspective for clean architectural lines and elegant proportions.';
  if (perspective === 'moderate-perspective') perspectiveDesc = 'Moderate optical perspective providing tangible three-dimensional depth and physical volume.';
  if (perspective === 'intimate-close') perspectiveDesc = 'Intimate optical perspective drawing the viewer close to tactile surface details.';

  let focalDesc = 'Medium format 80mm prime lens rendering true-to-life geometry.';
  if (focal === 'short-telephoto') focalDesc = '100mm short telephoto macro lens character for crisp edge definition and flattened perspective.';
  if (focal === 'portrait-like') focalDesc = '85mm portrait lens character delivering elegant subject isolation.';
  if (focal === 'macro-detail') focalDesc = '120mm macro lens character rendering razor-sharp micro-textures and foil detail.';
  if (focal === 'longer-compressed') focalDesc = '150mm compressed perspective lens character for calm, orderly studio composition.';

  let dofDesc = 'f/5.6 aperture providing tack-sharp clarity across the entire product with gentle, organic depth falloff in the background.';
  if (dof === 'deep-clarity') dofDesc = 'f/8 deep depth of field keeping the product and immediate surroundings in sharp, crisp clarity.';
  if (dof === 'moderate-depth') dofDesc = 'f/4.5 moderate depth of field keeping the main product face sharp with soft, natural background falloff.';
  if (dof === 'shallow-editorial') dofDesc = 'f/2.8 shallow editorial depth of field focusing tack-sharp on front product details while background elements melt into silky bokeh.';

  return `CAMERA & VIEWPOINT DIRECTION (BOUNDED VARIATION):
• Shot Type: ${shotDesc}
• Angle & Viewpoint: ${angleDesc}
• Optical Perspective: ${perspectiveDesc}
• Focal Character: ${focalDesc}
• Depth of Field: ${dofDesc}`;
}

// ==========================================
// 4. Composition & Negative Space
// ==========================================
export function getCompositionPromptText(options: PromptOptions): string {
  const comp = options.compositionStyle || 'centered';
  const space = options.negativeSpace || 'balanced';
  const pos = options.productPosition || 'centered';
  const pres = options.productPresentation || 'editorial';

  let compDesc = 'Centered hero composition with calm, balanced framing and generous negative space.';
  switch (comp) {
    case 'slightly-offset':
      compDesc = 'Slightly offset editorial framing adhering to golden-ratio rules, creating dynamic visual breathing room.';
      break;
    case 'left-weighted':
      compDesc = 'Left-weighted compositional alignment with the hero product positioned on the left two-thirds, balancing negative space on the right.';
      break;
    case 'right-weighted':
      compDesc = 'Right-weighted compositional arrangement with the product resting gracefully on the right, leaving open breathing space on the left.';
      break;
    case 'symmetrical':
      compDesc = 'Clean, symmetrical architectural composition creating tranquil formal equilibrium.';
      break;
    case 'asymmetric-editorial':
      compDesc = 'Asymmetric editorial composition with effortless, unforced placement that feels curated and artistic.';
      break;
    case 'generous-negative-space':
      compDesc = 'Spacious editorial composition with expansive, uncluttered negative space surrounding the product.';
      break;
    case 'tight-crop':
      compDesc = 'Tight, focused product framing celebrating craftsmanship and fine details without distracting empty space.';
      break;
    case 'medium-framing':
      compDesc = 'Balanced medium product framing showing the hero item and its immediate surface grounding.';
      break;
    case 'natural-arrangement':
      compDesc = 'Natural editorial arrangement where the product rests organically in harmony with the scene geometry.';
      break;
  }

  let positionDesc = 'Position the product firmly as the primary focal point.';
  if (pos === 'slightly-left') positionDesc = 'Position the product slightly left of center.';
  if (pos === 'slightly-right') positionDesc = 'Position the product slightly right of center.';
  if (pos === 'upper-composition') positionDesc = 'Position the product in the upper-center composition area.';
  if (pos === 'lower-composition') positionDesc = 'Position the product in the lower-center composition area with open space above.';
  if (pos === 'naturally-positioned') positionDesc = 'Position the product naturally within the composition space.';

  let presentationDesc = 'Editorial studio still-life presentation.';
  if (pres === 'clean-hero') presentationDesc = 'Clean, high-impact hero product presentation.';
  if (pres === 'catalog') presentationDesc = 'Pristine e-commerce catalog presentation.';
  if (pres === 'lifestyle-still-life') presentationDesc = 'Lifestyle-inspired tactile still-life presentation.';

  return `COMPOSITION & FRAMING DIRECTIVES:
• Composition Style: ${compDesc}
• Placement: ${positionDesc} ${presentationDesc}
• Negative Space Balance: Maintain ${space} negative space for calm breathing room and clean visual hierarchy.`;
}

// ==========================================
// 5. Environment & Background System (With Photographic Variation)
// ==========================================
export function getBackgroundPromptText(bg: BackgroundStyle, surface?: SurfaceStyle, palette?: ColorPalette): string {
  const brandColors = 'Science of Gifts signature palette incorporating soft powder blue (#99BFF9 / #A8C5DA) and delicate seafoam mint (#C3F3DF / #BCE3D8), with deeper brand blues (#28537D / #1B3D5F)';

  switch (bg) {
    case 'science-gradient':
    case 'gradient-wall-neutral-surface':
    case 'gradient-cyclorama':
    case 'gradient-curved-wall':
      return `Science of Gifts Studio Gradient Backdrop (Photographic Variation):
  - Environment: A physical, three-dimensional studio wall or curved cyclorama bathed in soft, real studio illumination.
  - Color Palette: ${brandColors}.
  - Photographic Gradient Direction & Balance (Allow Natural Variation): The transition between powder blue and seafoam mint must feel like genuine physical light on a matte painted wall, NOT a flat digital vector gradient. Allow natural variation between generations in:
    1. Color dominance (which color softly leads)
    2. Gradient transition direction (horizontal, subtle diagonal, or vertical glow)
    3. Transition softness and location of the gentle tonal shift
    4. Relative balance of blue, mint, and neutral ivory space
    The background remains an understated, physical studio environment supporting the hero product.`;

    case 'blue-wall-neutral-surface':
    case 'blue-dominant-gradient':
    case 'soft-blue-tonal':
      return `Blue-Tonal Studio Backwall + Neutral Surface:
  - Upper Zone: A muted, soft powder-blue painted studio vertical wall (#99BFF9 / #A8C5DA) with gentle matte texture and natural directional light falloff.
  - Lower Zone: A tangible, realistic neutral physical surface grounding the product with soft, natural contact shadows.
  - Natural Photographic Depth: The wall illuminates subtly behind the product, providing tranquil, elegant depth without flat digital fills. Allow minor variations in light glow location between generations.`;

    case 'mint-wall-neutral-surface':
    case 'mint-dominant-gradient':
    case 'soft-mint-tonal':
      return `Mint-Tonal Studio Backwall + Neutral Surface:
  - Upper Zone: A soothing, soft seafoam-mint painted studio vertical wall (#C3F3DF / #BCE3D8) with subtle architectural matte texture and gentle ambient light gradation.
  - Lower Zone: A tangible neutral physical surface grounding the product with authentic contact shadows.
  - Natural Photographic Depth: The mint wall creates a fresh, sophisticated, calming backdrop. Allow natural variation in shadow diffusion and light softness between generations.`;

    case 'branded-editorial-environment':
      return `Branded Science of Gifts Editorial Environment:
  - Architecture & Ambiance: A quiet three-dimensional studio environment where the Science of Gifts blue and mint palette is woven subtly into background wall architecture, soft bounce light, and environmental depth.
  - Materials: Real physical materials—plaster, honed stone, matte wood—with authentic light reflections. The signature colors act as atmospheric accents rather than a single flat backdrop.`;

    case 'dark-editorial':
      return `Dark Editorial Studio Environment:
  - Setting: A sophisticated darker studio environment utilizing deep muted charcoal (#1B3D5F / #1E293B), dark slate, and velvety soft shadows.
  - Lighting: Sculpted key lighting that casts subtle rim highlights along product contours, creating rich contrast and quiet dramatic luxury.`;

    case 'warm-ivory':
    case 'alabaster':
    case 'pale-stone':
    case 'soft-warm-gray':
    case 'pale-blue-gray':
    case 'neutral-editorial':
      return `Neutral Editorial Studio Environment:
  - Setting: A realistic, light neutral studio environment with understated off-white, warm alabaster, or pale stone backdrops.
  - Lighting: Soft, diffused natural studio illumination with calm, generous negative space keeping 100% of visual focus on the product.`;

    case 'custom':
      return `Custom Background Environment: Configured according to additional instructions while strictly maintaining physical studio lighting, natural depth of field, and tangible material realism.`;

    default:
      return `Clean minimalist studio backdrop with soft, diffused illumination and photographic depth.`;
  }
}

// ==========================================
// 6. Surface System
// ==========================================
export function getSurfacePromptText(surface: SurfaceStyle, palette?: ColorPalette): string {
  switch (surface) {
    case 'editorial-tabletop':
      return 'Editorial Tabletop: Resting firmly on a honed pale travertine limestone slab or natural light white oak tabletop, with fine tactile texture, subtle micro-bevels, and soft, natural contact shadows.';
    case 'light-stone':
    case 'light-limestone':
    case 'travertine':
      return 'Light Stone Surface: Resting on a pale honed limestone, light travertine, or fine-grain architectural terrazzo surface with organic mineral flecks and authentic ambient occlusion shadows.';
    case 'light-wood':
      return 'Light Natural Wood Surface: Resting on a smooth, pale matte white oak or ash wood surface with subtle natural wood grain.';
    case 'dark-matte':
      return 'Dark Matte Surface: Resting on a deep charcoal slate or dark honed stone surface with subtle rim light reflection and rich, grounded contact shadows.';
    case 'soft-fabric':
      return 'Soft Fabric Surface: Resting upon naturally draped heavyweight unbleached raw linen with gentle organic folds and tactile textile weave.';
    case 'paper-archival':
      return 'Archival Paper Surface: Resting on a smooth sheet of heavyweight 300 GSM cotton rag paper with subtle deckle edge and tactile paper tooth.';
    case 'warm-ivory-surface':
      return 'Warm Ivory Surface: Resting on a pale warm ivory matte studio surface with soft contact shadow diffusion.';
    case 'blue-gray-surface':
      return 'Blue-Gray Surface: Resting on a tranquil pale blue-gray honed surface that harmonizes quietly with the product.';
    case 'no-visible-surface':
      return 'No Visible Surface: Floating seamlessly in atmospheric negative space with subtle diffuse glow, zero floor boundary line, and soft ethereal presence.';
    case 'naturally-implied':
    default:
      return 'Pristine neutral physical surface grounding the product with authentic contact shadows and ambient occlusion.';
  }
}

// ==========================================
// 7. Lighting System
// ==========================================
export function getLightingPromptText(style?: LightingStyle, shadow?: ShadowCharacter): string {
  let lightDesc = 'Soft, diffused north-facing studio daylight augmented by a large softbox key light. Subtle gradations, zero harsh specular hotspots, and authentic natural contact shadows.';
  switch (style) {
    case 'soft-daylight':
      lightDesc = 'Soft, natural daylight filtering through a large diffused studio window, creating gentle organic highlights and tranquil atmospheric glow.';
      break;
    case 'gentle-window':
      lightDesc = 'Gentle side window illumination coming from the upper-left, illuminating subtle surface textures with soft directional raking light.';
      break;
    case 'side-lit-editorial':
      lightDesc = 'Side-lit editorial lighting casting soft directional illumination across product contours and materials.';
      break;
    case 'soft-top-left':
      lightDesc = 'Classic top-left softbox lighting creating clean, predictable highlights and gentle downward shadow gradation.';
      break;
    case 'diffused-frontal':
      lightDesc = 'Diffused frontal fill lighting with subtle fill bounces, ensuring every text detail and artwork element remains clearly legible.';
      break;
    case 'sculpted-studio':
      lightDesc = 'Sculpted commercial studio lighting utilizing a key softbox, subtle rim reflector, and ambient fill to give the product three-dimensional dimension.';
      break;
    case 'quiet-dramatic':
      lightDesc = 'Quiet dramatic lighting with controlled contrast, deep soft shadows, and selective specular accents highlighting key material edges.';
      break;
    case 'bright-catalog':
      lightDesc = 'Bright, clean catalog illumination with even light distribution, high clarity, and zero dark murky shadows.';
      break;
    case 'warm-editorial':
      lightDesc = 'Warm editorial studio lighting with a subtle golden-hour warmth (3800K) creating a cozy, inviting atmosphere.';
      break;
    case 'natural-directional':
      lightDesc = 'Natural directional light with organic falloff and realistic light bounce from surrounding neutral surfaces.';
      break;
  }

  let shadowDesc = 'soft, natural contact shadows grounding the object.';
  if (shadow === 'very-soft') shadowDesc = 'extremely soft, whisper-light contact shadows with wide diffuse penumbras.';
  if (shadow === 'moderate') shadowDesc = 'moderate, well-defined contact shadows giving clear physical weight.';
  if (shadow === 'defined-natural') shadowDesc = 'defined but natural shadows that anchor the product firmly to the surface plane.';

  return `LIGHTING & SHADOW SPECIFICATIONS:
• Lighting Direction & Style: ${lightDesc}
• Shadow Quality: Features ${shadowDesc}`;
}

// ==========================================
// 8. Styling & Props System (With Bounded Variation)
// ==========================================
export function getPropsPromptText(options: PromptOptions): string {
  const level = options.propLevel || (options.props === 'none' ? 'none' : 'minimal');
  const family = options.propFamily || 'category-aware';
  const placement = options.propPlacement || 'background-only';
  const productType = options.productType;

  if (level === 'none' || options.props === 'none') {
    return `STYLING & PROPS DIRECTIVE:
• Prop Level: None. Pure minimalist hero product composition with generous negative space, keeping 100% of viewer attention on the hero object.`;
  }

  let familyDesc = 'restrained, intellectual objects appropriate to the Science of Gifts collection';
  switch (family) {
    case 'historical-archival':
      familyDesc = 'historically appropriate archival objects (such as an antique brass caliper, a subtle celestial chart fragment, or an aged leather journal fragment)';
      break;
    case 'scientific':
      familyDesc = 'clean scientific accents (such as a minimal glass prism, a small brass weight, or a geometric ceramic block)';
      break;
    case 'writing-desk':
      familyDesc = 'refined stationery items (such as a fountain pen with brass nib, deckle-edge paper, or a wooden ruler)';
      break;
    case 'film-cinema':
      familyDesc = 'subtle cinema & optics ephemera (a vintage camera lens element or archival film strip strip)';
      break;
    case 'literary':
      familyDesc = 'classic literary items (such as an antique cloth-bound volume or linen bookmark)';
      break;
    case 'natural-botanical':
      familyDesc = 'understated organic botanicals (such as a single dried eucalyptus stem, pressed leaf, or dried lotus pod)';
      break;
    case 'architectural':
      familyDesc = 'minimal architectural props (such as a pale travertine block or geometric stone pedestal)';
      break;
    case 'seasonal':
      familyDesc = 'seasonal organic accents arranged with utmost restraint';
      break;
    case 'category-aware':
    default:
      if (productType === 'notebook') familyDesc = 'writing & stationery accents (fountain pen, brass paper clip, or deckle-edge paper)';
      else if (productType === 'mug' || productType === 'glass') familyDesc = 'coffee / tea ritual accents (whole roasted coffee beans, cinnamon stick, or linen coaster)';
      else if (productType === 'waterBottle' || productType === 'tumbler') familyDesc = 'clean hydration / desk accents (minimal stone coaster or wooden lid)';
      else if (productType === 'tshirt' || productType === 'hoodie') familyDesc = 'textile & design ephemera (cloth-bound book or minimal ceramic dish)';
      else familyDesc = 'curated archival & design accents';
      break;
  }

  let placementDesc = 'placed quietly in the soft background with shallow depth of field (f/4)';
  if (placement === 'beside-product') placementDesc = 'placed beside the hero product at a respectful distance';
  if (placement === 'foreground-accent') placementDesc = 'positioned as a subtle blurred foreground accent in lower corner';
  if (placement === 'edge-of-frame') placementDesc = 'partially resting at the outer edge of frame';
  if (placement === 'asymmetric') placementDesc = 'arranged asymmetrically to balance the product composition';
  if (placement === 'naturally-arranged') placementDesc = 'naturally resting on the surface in an unforced, organic layout';

  return `STYLING & PROPS DIRECTIVE (BOUNDED PROP VARIATION):
• Prop Level: ${level} (${familyDesc}).
• Prop Placement: ${placementDesc}.
• PROP VARIATION INSTRUCTION: Introduce a restrained selection of relevant objects chosen naturally for the subject. Allow the specific prop objects, exact count (1–3 items max), scale, rotation, and micro-placement to vary naturally between generations. Props MUST remain secondary to the hero product and must NEVER form a repetitive stock still-life arrangement.`;
}

// ==========================================
// 9. Color Palette System
// ==========================================
export function getColorPromptText(palette?: ColorPalette): string {
  let paletteDesc = 'Science of Gifts Signature Palette — Soft powder blue (#99BFF9), delicate seafoam mint (#C3F3DF), and warm ivory (#FFFDFA) with deep navy (#1B3D5F) accents.';
  switch (palette) {
    case 'powder-blue':
      paletteDesc = 'Powder Blue Dominant Palette — Tranquil soft powder blue (#99BFF9 / #A8C5DA) paired with warm alabaster and light stone.';
      break;
    case 'seafoam-mint':
      paletteDesc = 'Seafoam Mint Dominant Palette — Soothing seafoam mint (#C3F3DF / #BCE3D8) paired with pale linen and light travertine.';
      break;
    case 'blue-ivory':
      paletteDesc = 'Blue & Ivory Palette — Powder blue backwall paired with warm ivory surfaces and gold accents.';
      break;
    case 'mint-ivory':
      paletteDesc = 'Mint & Ivory Palette — Seafoam mint backwall paired with pale warm ivory and natural oak.';
      break;
    case 'warm-ivory':
      paletteDesc = 'Warm Ivory Palette — Soft off-white, warm alabaster, and pale linen tones.';
      break;
    case 'pale-blue-gray':
      paletteDesc = 'Pale Blue-Gray Palette — Muted blue-gray studio tones with neutral stone surfaces.';
      break;
    case 'neutral-editorial':
      paletteDesc = 'Neutral Editorial Palette — Clean white, warm alabaster, pale limestone, and light wood.';
      break;
    case 'deep-editorial':
      paletteDesc = 'Deep Editorial Palette — Rich charcoal, graphite, dark slate, and deep navy tones.';
      break;
    case 'charcoal-ivory':
      paletteDesc = 'Charcoal & Ivory Palette — Striking contrast between deep charcoal surfaces and warm ivory background glow.';
      break;
  }

  return `COLOR DIRECTION:
• Palette: ${paletteDesc}
• CRITICAL COLOR RULE: Color direction applies strictly to the environment, backdrops, surfaces, lighting atmosphere, and props. NEVER alter or shift the actual product artwork, printed colors, or material colors of the hero item.`;
}

// ==========================================
// 10. Controlled Variation System
// ==========================================
export function getControlledVariationPromptText(level?: VariationLevel, toggles?: VariationToggles): string {
  const varLevel = level || 'moderate';

  let variationDesc = 'Moderate controlled variation across generations while keeping the visual identity completely coherent.';
  if (varLevel === 'consistent') variationDesc = 'Strict visual consistency with minimal micro-variations across generations.';
  if (varLevel === 'subtle') variationDesc = 'Subtle controlled variations in lighting angle and micro-placement across generations.';
  if (varLevel === 'strong') variationDesc = 'Dynamic creative variations in camera viewpoint, composition, and prop styling across generations.';

  return `CONTROLLED VARIATION DIRECTIVE:
• Variation Scope: ${variationDesc}
• DISTINCTION BETWEEN FIXED vs VARIABLE ELEMENTS:
  - FIXED CONSTRAINTS (MUST NEVER VARY): Exact product identity, artwork, typography, logos, physical construction, colors, proportions, and product fidelity rules.
  - VARIABLE CREATIVE ELEMENTS (ALLOWED TO VARY NATURALLY): Exact camera micro-angle (±5°), slight product rotation (±10°), prop selection and placement, lighting highlight positioning, background gradient transition softness, and negative space balance between individual generations.`;
}

// ==========================================
// 11. Technical Settings & Output Requirements
// ==========================================
export function formatTechnicalSettings(aspectRatio: AspectRatio): string {
  return `TECHNICAL & CAMERA HARDWARE SPECIFICATIONS:
• Camera: Medium format digital camera system (Hasselblad H6D-100c / Phase One XF IQ4 150MP)
• Optics: Prime macro product lens at f/5.6 for tack-sharp product resolution with natural optical falloff
• Color & White Balance: Clean, authentic color reproduction matching the reference product accurately, true-to-life 5500K daylight balance, soft photographic contrast curve
• Aspect Ratio: ${aspectRatio}`;
}

export function formatNegativeExclusions(extraExclusions: string[] = []): string {
  const defaultExclusions = [
    'No human models, no visible hands, no people, no phantom mannequins',
    'No artificial watermarks, no copyright text, no promotional badges, no floating graphic overlays',
    'No 3D CGI cartoon look, no oversaturated illustration style, no plastic skinning',
    'No flat digital vector gradients, no graphic fills, no artificial color blocks',
    'No excessive color saturation; background must never overpower the hero product',
    'Do NOT redesign, replace, or invent new graphics, text, or logos on the product',
    'Do NOT distort product proportions, warp logos, or bend straight product edges',
  ];

  const allExclusions = [...defaultExclusions, ...extraExclusions];
  return `STRICT EXCLUSIONS (NEGATIVE PROMPTS):
${allExclusions.map((item) => `• ${item}`).join('\n')}`;
}

export function formatAdditionalInstructions(instructions?: string): string {
  if (!instructions || !instructions.trim()) {
    return '';
  }
  return `\nADDITIONAL USER INSTRUCTIONS:\n${instructions.trim()}\n`;
}

// ==========================================
// 12. Master Photography Prompt Assembler
// ==========================================
export interface MasterPromptParams {
  productTypeName: string;
  productDescription: string;
  productFidelityDirectives: string[];
  productOrientationText: string;
  productSpecificExclusions?: string[];
}

export function buildMasterPhotographyPrompt(
  options: PromptOptions,
  params: MasterPromptParams
): string {
  const referenceHeader = formatReferenceHeader(options.hasReferenceImage, options.referenceImageName);
  const universalPreservation = getUniversalPreservationRules();
  const themeText = getThemePromptText(options.theme);
  const cameraText = getCameraPromptText(options);
  const compositionText = getCompositionPromptText(options);
  const backgroundText = getBackgroundPromptText(options.background, options.surface, options.colorPalette);
  const surfaceText = getSurfacePromptText(options.surface, options.colorPalette);
  const lightingText = getLightingPromptText(options.lightingStyle, options.shadowCharacter);
  const propsText = getPropsPromptText(options);
  const colorText = getColorPromptText(options.colorPalette);
  const variationText = getControlledVariationPromptText(options.variationLevel, options.variationToggles);
  const technicalSettings = formatTechnicalSettings(options.aspectRatio);
  const negativeExclusions = formatNegativeExclusions(params.productSpecificExclusions || []);
  const additionalInstructions = formatAdditionalInstructions(options.additionalInstructions);

  const productFidelityBlock = params.productFidelityDirectives
    .map((directive) => `• ${directive}`)
    .join('\n');

  return `Commercial Editorial Product Photograph — Science of Gifts Studio

${referenceHeader}

${universalPreservation}

PRODUCT IDENTIFICATION:
• Hero Product: ${params.productDescription}
• Product Category: ${params.productTypeName}
• Orientation & Staging: ${params.productOrientationText}

PRODUCT-SPECIFIC FIDELITY DIRECTIVES:
${productFidelityBlock}

CREATIVE DIRECTION & THEME:
• ${themeText}

${cameraText}

${compositionText}

ENVIRONMENT, BACKGROUND & SURFACE:
• ${backgroundText}
• ${surfaceText}

${lightingText}

${propsText}

${colorText}

${variationText}

${technicalSettings}

${negativeExclusions}
${additionalInstructions}
FINAL OUTPUT REQUIREMENT:
A finished, hyper-realistic commercial studio product photograph ready for publication in high-end editorial catalogs and boutique e-commerce galleries. The hero product must remain tack-sharp, authentic, and protected.`;
}
