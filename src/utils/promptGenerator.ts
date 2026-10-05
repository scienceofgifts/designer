import { PromptStudioSelections, DesignDna, DesignItem } from '../types';

/**
 * Generates an artwork-only instruction block tailored to the selected product.
 * Guarantees image generators create the isolated graphic artwork itself rather than
 * product mockups, mannequins, people wearing apparel, or physical staging.
 */
function getArtworkOnlyDirective(product: string): string {
  const prod = product.toLowerCase();

  if (prod.includes('t-shirt') || prod.includes('hoodie') || prod.includes('sweatshirt') || prod.includes('apparel')) {
    return 'CRITICAL ARTWORK-ONLY INSTRUCTION: Create the isolated graphic design/artwork itself suitable for textile screen-print reproduction on apparel. Present the finished design flat as an isolated graphic composition on a clean background. Do NOT create a product mockup, photograph of a physical garment, person wearing clothes, mannequin, folded cloth, fabric wrinkles, or studio product photography.';
  }

  if (prod.includes('poster') || prod.includes('print')) {
    return 'CRITICAL ARTWORK-ONLY INSTRUCTION: Create the flat 2D graphic art composition suitable for archival serigraph or letterpress printing. Present the artwork itself directly with clean borders and edges. Do NOT render a physical picture frame, wall interior mockup, poster clips, or room photography.';
  }

  if (prod.includes('mug') || prod.includes('bottle') || prod.includes('tumbler') || prod.includes('drinkware')) {
    return 'CRITICAL ARTWORK-ONLY INSTRUCTION: Create the flat 2D graphic decal/emblem design intended for drinkware application. Present the isolated graphic artwork directly. Do NOT render a 3D ceramic mug, table surface, kitchen background, steam, or product catalog photograph.';
  }

  if (prod.includes('journal') || prod.includes('notebook') || prod.includes('book')) {
    return 'CRITICAL ARTWORK-ONLY INSTRUCTION: Create the flat 2D cover graphic design and layout directly. Do NOT render a 3D book mockup, stationery staging, table background, or physical desk photograph.';
  }

  return 'CRITICAL ARTWORK-ONLY INSTRUCTION: Create the standalone graphic artwork itself. Present the finished design as a clean, flat, high-resolution vector/raster graphic composition suitable for printing, without physical product mockups, 3D renders, or staging.';
}

/**
 * Generates negative prompt parameters tailored to prevent mockup hallucination.
 */
function getNegativeDirectives(product: string): string[] {
  const base = [
    'product mockup',
    'photograph of physical product',
    '3D product render',
    'commercial catalog photography',
    'low-resolution clipart',
    'broken or illegible hallucinated glyphs',
    'tacky plastic 3D bevels',
    'glossy lens flares',
  ];

  const prod = product.toLowerCase();
  if (prod.includes('t-shirt') || prod.includes('hoodie') || prod.includes('sweatshirt')) {
    base.unshift('model wearing garment', 'person wearing shirt', 'mannequin', 'fabric folds', 'wrinkled cloth', 'hanger mockup');
  } else if (prod.includes('poster')) {
    base.unshift('framed picture on wall', 'room interior background', 'living room mockup', 'poster clips');
  } else if (prod.includes('mug') || prod.includes('bottle')) {
    base.unshift('3D ceramic cup', 'table surface', 'hands holding mug', 'kitchen scene');
  }

  return base;
}

/**
 * Extracts specific stored analysis traits from an individual reference design
 * strictly based on the user's checked borrowed aspects.
 */
export function extractBorrowedTraits(
  design: DesignItem,
  borrowedAspects: string[]
): string[] {
  const traits: string[] = [];
  const analysis = design.analysis;

  if (!analysis) {
    traits.push(
      `Category: ${design.category}. Borrow visual principles for: ${borrowedAspects.join(', ')}.`
    );
    return traits;
  }

  const {
    visualCharacteristics,
    conceptualCharacteristics,
    distinctiveCharacteristics,
    techniques,
    whyItWorks,
  } = analysis;

  borrowedAspects.forEach((aspect) => {
    switch (aspect) {
      case 'Typography':
        if (visualCharacteristics?.typography) {
          traits.push(`Typography Grammar: ${visualCharacteristics.typography}`);
        }
        break;

      case 'Composition':
        if (visualCharacteristics?.composition) {
          let comp = `Compositional Framing: ${visualCharacteristics.composition}`;
          if (visualCharacteristics.symmetry) comp += ` (${visualCharacteristics.symmetry})`;
          if (visualCharacteristics.negativeSpace) comp += `. Negative space discipline: ${visualCharacteristics.negativeSpace}`;
          traits.push(comp);
        }
        break;

      case 'Color':
        if (visualCharacteristics?.colorPalette) {
          traits.push(`Color Strategy & Ink Tones: ${visualCharacteristics.colorPalette}`);
        }
        break;

      case 'Concept':
        if (conceptualCharacteristics) {
          const parts: string[] = [];
          if (conceptualCharacteristics.concept) parts.push(conceptualCharacteristics.concept);
          if (conceptualCharacteristics.tone) parts.push(`Tone: ${conceptualCharacteristics.tone}`);
          if (conceptualCharacteristics.emotionalQuality) parts.push(`Atmosphere: ${conceptualCharacteristics.emotionalQuality}`);
          if (parts.length > 0) {
            traits.push(`Conceptual Narrative: ${parts.join('. ')}`);
          }
        }
        break;

      case 'Layout':
        if (visualCharacteristics?.layout || visualCharacteristics?.visualHierarchy) {
          const parts: string[] = [];
          if (visualCharacteristics.layout) parts.push(`Canvas Placement: ${visualCharacteristics.layout}`);
          if (visualCharacteristics.visualHierarchy) parts.push(`Visual Hierarchy: ${visualCharacteristics.visualHierarchy}`);
          if (visualCharacteristics.density) parts.push(`Density: ${visualCharacteristics.density}`);
          traits.push(`Layout Architecture: ${parts.join('. ')}`);
        }
        break;

      case 'Overall aesthetic':
        {
          const parts: string[] = [];
          if (distinctiveCharacteristics && distinctiveCharacteristics.length > 0) {
            parts.push(`Distinctive traits: ${distinctiveCharacteristics.slice(0, 2).join('; ')}`);
          }
          if (techniques && techniques.length > 0) {
            parts.push(`Key techniques: ${techniques.slice(0, 3).join(', ')}`);
          }
          if (parts.length === 0 && whyItWorks) {
            parts.push(whyItWorks);
          }
          if (parts.length > 0) {
            traits.push(`Overall Aesthetic Grammar: ${parts.join('. ')}`);
          }
        }
        break;
    }
  });

  return traits;
}

/**
 * Generates the unified, cohesive master prompt intended for direct copy-pasting
 * into AI image generation models (Midjourney, Flux, Imagen, DALL-E, etc.).
 *
 * Logically combines:
 * 1. Current Project Requirements (Product, Subject, Style, Typography, Layout, Color, Concept)
 * 2. Creator Design DNA (Persistent creator habits & anti-patterns)
 * 3. Individual Reference DNA (Extracted from stored Gemini analysis per checked borrowed aspect)
 * 4. Additional Comments (User's freeform custom directives)
 * 5. Artwork-Only & Print Production Rules (Guarantees flat graphic art rather than product mockups)
 * 6. Negative Directives
 */
export function generateDeterministicPrompt(
  selections: PromptStudioSelections,
  dna: DesignDna | null,
  libraryDesigns: DesignItem[]
): string {
  const {
    product = 'T-shirt',
    categories = [],
    visualStyles = [],
    treatments = [],
    typeCharacter = [],
    typeHierarchy = '',
    typeTreatment = [],
    composition = [],
    colorStrategy = 'Limited palette',
    palette = 'Black + Cream',
    customColorNotes = '',
    concepts = [],
    subject = '',
    additionalComments = '',
    useDesignDna = false,
    dnaInfluence = 'Balanced',
    references = [],
  } = selections;

  // Filter out sentinel "Unspecified" markers
  const cleanCategories = categories.filter((c) => c !== 'Unspecified' && c !== 'Any / Unspecified');
  const cleanVisualStyles = visualStyles.filter((s) => s !== 'Unspecified' && s !== 'Any / Unspecified');
  const cleanTreatments = treatments.filter((t) => t !== 'Unspecified' && t !== 'Any / Unspecified');
  const cleanTypeCharacter = typeCharacter.filter((t) => t !== 'Unspecified' && t !== 'Any / Unspecified');
  const cleanTypeTreatment = typeTreatment.filter((t) => t !== 'Unspecified' && t !== 'Any / Unspecified');
  const cleanComposition = composition.filter((c) => c !== 'Unspecified' && c !== 'Any / Unspecified');
  const cleanConcepts = concepts.filter((c) => c !== 'Unspecified' && c !== 'Any / Unspecified');

  const isColorUnspecified =
    palette === 'Unspecified' ||
    palette === 'Any / Unspecified' ||
    colorStrategy === 'Unspecified' ||
    colorStrategy === 'Any / Unspecified';

  // 1. Creative Direction & Subject
  const categoryPhrase = cleanCategories.length > 0 ? `${cleanCategories.join(' & ')} graphic design` : 'Graphic design artwork';
  const stylePhrase = cleanVisualStyles.length > 0 ? `in a ${cleanVisualStyles.join(', ').toLowerCase()} aesthetic` : '';
  const subjectText = subject.trim() || 'Visual theme and conceptual letterform statement';
  
  const leadStatement = `A distinctive, museum-grade ${categoryPhrase} centered on "${subjectText}"${stylePhrase ? `, ${stylePhrase}` : ''}, designed specifically as finished artwork for ${product} reproduction.`;

  // 2. Artwork-Only Directive (NO PRODUCT MOCKUPS)
  const artworkDirective = getArtworkOnlyDirective(product);

  // 3. Visual Language & Printing Treatments
  let visualLanguage = '';
  const stylesAndTreatments = [...cleanVisualStyles, ...cleanTreatments];
  if (stylesAndTreatments.length > 0) {
    visualLanguage = `Visual execution features ${cleanVisualStyles.join(', ')}${
      cleanTreatments.length > 0 ? ` with authentic ${cleanTreatments.join(', ')} printing characteristics` : ''
    }. Render with tactile ink deposit weight, authentic substrate grain, and crisp serigraph registration, avoiding artificial synthetic digital gloss.`;
  } else {
    visualLanguage = 'Render with disciplined craftsmanship, natural ink deposit texture, and clean vector/serigraphic edges.';
  }

  // 4. Structural Framework / Category Mode
  let structuralMode = '';
  if (cleanCategories.length > 0) {
    if (cleanCategories.includes('Definition')) {
      structuralMode = 'Framed with structured linguistic definition hierarchy, authoritative lexical annotations, and subtle typographic grid rules.';
    } else if (cleanCategories.includes('Badge / Emblem')) {
      structuralMode = 'Structured as a cohesive crest/insignia badge with balanced geometric framing and refined vintage heraldic symmetry.';
    } else if (cleanCategories.includes('Typography')) {
      structuralMode = 'Driven by pure typographic hierarchy, letterform craftsmanship, and deliberate spatial balance.';
    } else {
      structuralMode = `Framework calibrated for ${cleanCategories.join(', ')} execution with deliberate graphical purpose for every element.`;
    }
  }

  // 5. Typography Architecture
  let typographyRules = '';
  const isTypeHierarchyUnspecified = !typeHierarchy || typeHierarchy === 'Unspecified' || typeHierarchy === 'Any / Unspecified';
  if (cleanTypeCharacter.length > 0 || !isTypeHierarchyUnspecified || cleanTypeTreatment.length > 0) {
    const parts: string[] = [];
    if (cleanTypeCharacter.length > 0) parts.push(`Letterforms: ${cleanTypeCharacter.join(' / ')}`);
    if (!isTypeHierarchyUnspecified) parts.push(`Hierarchy: ${typeHierarchy}`);
    if (cleanTypeTreatment.length > 0) parts.push(`Treatment: ${cleanTypeTreatment.join(', ')}`);
    typographyRules = `${parts.join('. ')}. Enforce deliberate letter-spacing and crisp optical weight contrast between primary titular elements and secondary annotations.`;
  }

  // 6. Composition & Spatial Geometry
  let compositionRules = '';
  if (cleanComposition.length > 0) {
    compositionRules = `Compositional architecture: ${cleanComposition.join(', ')}. Anchor the primary visual focus deliberately with generous negative space breathing room, avoiding cluttered edge-to-edge crowding.`;
  } else {
    compositionRules = 'Balanced spatial layout with generous breathing room and natural figure-ground separation.';
  }

  // 7. Color Strategy & Inks
  let colorRules = '';
  if (!isColorUnspecified) {
    colorRules = `Color palette: ${palette} (${colorStrategy}).`;
    if (customColorNotes.trim()) {
      colorRules += ` Specific color notes: ${customColorNotes.trim()}.`;
    }
    colorRules += ' Rich, saturated ink tones calibrated cleanly against the background substrate.';
  } else if (customColorNotes.trim()) {
    colorRules = `Custom color notes: ${customColorNotes.trim()}.`;
  }

  // 8. Conceptual Resonance
  let conceptRules = '';
  if (cleanConcepts.length > 0) {
    conceptRules = `Conceptual tone: ${cleanConcepts.join(', ')}. Communicates with intellectual nuance, understated wit, and editorial confidence.`;
  }

  // 9. Creator Design DNA Integration (Layer A)
  let dnaRules = '';
  if (useDesignDna && dna) {
    const dnaTraits: string[] = [];
    if (dna.philosophy) dnaTraits.push(`Philosophy: "${dna.philosophy}"`);
    if (dna.typography?.length) dnaTraits.push(`Type style: ${dna.typography.slice(0, 2).map((t) => t.trait).join(', ')}`);
    if (dna.composition?.length) dnaTraits.push(`Layout: ${dna.composition.slice(0, 2).map((t) => t.trait).join(', ')}`);
    if (dna.color?.length) dnaTraits.push(`Palette: ${dna.color.slice(0, 2).map((t) => t.trait).join(', ')}`);
    if (dna.avoid?.length) dnaTraits.push(`DNA Anti-patterns: Avoid ${dna.avoid.slice(0, 3).join(', ')}`);

    dnaRules = `Creator Design DNA (${dnaInfluence} Influence): ${dnaTraits.join('. ')}.`;
  }

  // 10. Individual Reference DNA Integration (Layer B - Extracted from Stored Analysis)
  let referenceRules = '';
  if (references && references.length > 0) {
    const referenceBlocks: string[] = [];

    references.forEach((ref) => {
      const item = libraryDesigns.find((d) => d.id === ref.designId);
      if (!item) return;

      const aspects = ref.borrowedAspects && ref.borrowedAspects.length > 0
        ? ref.borrowedAspects
        : ['Overall aesthetic'];

      const traits = extractBorrowedTraits(item, aspects);
      if (traits.length > 0) {
        referenceBlocks.push(
          `• Reference "${item.name}" (Borrowing ${aspects.join(', ')}):\n  - ${traits.join('\n  - ')}`
        );
      }
    });

    if (referenceBlocks.length > 0) {
      referenceRules = `Structural principles borrowed from library references:\n${referenceBlocks.join(
        '\n'
      )}\nCRITICAL: Translate these structural rules and visual grammar into original artwork for "${subjectText}". Do not duplicate, copy, or trace the reference's literal artwork or distinct motifs.`;
    }
  }

  // 11. Additional Comments / Custom User Directives (Layer C)
  let userCommentsSection = '';
  if (additionalComments && additionalComments.trim()) {
    userCommentsSection = `Custom user directives: ${additionalComments.trim()}.`;
  }

  // 12. Negative Directives
  const negativeList = getNegativeDirectives(product);
  const negativePrompt = `--no ${negativeList.join(', ')}`;

  // Assemble into ONE cohesive, flowing unified prompt
  const sections = [
    leadStatement,
    artworkDirective,
    structuralMode,
    visualLanguage,
    typographyRules,
    compositionRules,
    colorRules,
    conceptRules,
    dnaRules,
    referenceRules,
    userCommentsSection,
    negativePrompt,
  ].filter((s) => s && s.trim().length > 0);

  return sections.join('\n\n');
}
