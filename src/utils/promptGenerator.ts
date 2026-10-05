import { PromptStudioSelections, DesignDna, DesignItem } from '../types';

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
    useDesignDna = false,
    dnaInfluence = 'Balanced',
    references = [],
  } = selections;

  // Filter out any "Unspecified" sentinel markers
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

  // 1. Creative Direction
  const categorySummary = cleanCategories.length > 0 ? cleanCategories.join(' & ') : 'Graphic';
  const styleSummary = cleanVisualStyles.length > 0 ? cleanVisualStyles.join(', ') : '';
  const stylePhrase = styleSummary ? `balancing ${styleSummary.toLowerCase()} aesthetics with ` : '';
  const creativeDirection = `Produce a distinctive, museum-grade graphic execution designed for print reproduction on a premium ${product}. The piece centers on the subject of "${
    subject.trim() || 'Untitled Concept'
  }", ${stylePhrase}disciplined craftsmanship and intentional visual restraint.`;

  // 2. Product Specification
  let productNotes = `High-end ${product} graphic.`;
  if (product.toLowerCase().includes('t-shirt') || product.toLowerCase().includes('hoodie') || product.toLowerCase().includes('sweatshirt')) {
    productNotes += ` Optimized for textile screen printing; crisp separation onto heavyweight combed organic cotton. Design must read cleanly at standard chest or back placement without awkward fabric warping.`;
  } else if (product.toLowerCase().includes('poster')) {
    productNotes += ` Archival art print format; fine serigraphic or letterpress resolution on heavyweight textured rag stock.`;
  } else if (product.toLowerCase().includes('mug') || product.toLowerCase().includes('bottle') || product.toLowerCase().includes('tumbler')) {
    productNotes += ` Cylindrical ceramic or powder-coated steel wrap profile; balanced 360-degree viewing rhythm with strong central emblem.`;
  } else {
    productNotes += ` Formatted for clean merchandise production with defined margins and crisp contour boundaries.`;
  }

  // 3. Subject & Narrative
  const subjectSection = subject.trim()
    ? `Thematic focus: "${subject.trim()}". Interpret this subject through intellectual depth and visual storytelling rather than generic clichéd symbols.`
    : 'No explicit subject specified. Focus on abstract typographic and compositional harmony.';

  // 4. Design Type & Structural Category
  let designTypeSection = '';
  if (cleanCategories.length > 0) {
    designTypeSection = `Execution mode: ${cleanCategories.join(', ')}. The visual framework prioritizes ${
      cleanCategories.includes('Definition')
        ? 'dictionary-format authority, structured linguistic definitions, and subtle typographical grid lines.'
        : cleanCategories.includes('Badge / Emblem')
        ? 'a cohesive heraldic crest, balanced circular/shield enclosure, and vintage insignia geometry.'
        : cleanCategories.includes('Typography')
        ? 'pure typographic hierarchy, letterform craftsmanship, and rhythmic spatial distribution.'
        : 'balanced graphic integration where every illustrative and typographic element has purpose.'
    }`;
  } else {
    designTypeSection = 'General graphic layout determined organically by subject requirements.';
  }

  // 5. Visual Style & Treatment
  const styleList = [...cleanVisualStyles, ...cleanTreatments];
  let visualStyleSection = '';
  if (styleList.length > 0) {
    visualStyleSection = `Aesthetic language: ${cleanVisualStyles.join(', ')}${
      cleanTreatments.length > 0 ? ` with ${cleanTreatments.join(', ')} physical printing treatments` : ''
    }. Maintain authentic textural grain, tangible ink deposit weight, and organic ink edges rather than artificial synthetic gloss or digital plastic sheen.`;
  } else {
    visualStyleSection = 'Open aesthetic direction; prioritize natural visual harmony, authentic physical substrate textures, and organic ink edges.';
  }

  // 6. Typography
  let typographySection = '';
  const isTypeHierarchyUnspecified = !typeHierarchy || typeHierarchy === 'Unspecified' || typeHierarchy === 'Any / Unspecified';
  if (cleanTypeCharacter.length > 0 || !isTypeHierarchyUnspecified || cleanTypeTreatment.length > 0) {
    const chars = cleanTypeCharacter.length > 0 ? `Letterform style: ${cleanTypeCharacter.join(' / ')}.` : '';
    const hier = !isTypeHierarchyUnspecified ? ` Hierarchical structure: ${typeHierarchy}.` : '';
    const treat = cleanTypeTreatment.length > 0 ? ` Surface treatment: ${cleanTypeTreatment.join(', ')}.` : '';
    typographySection = `${chars}${hier}${treat} Enforce deliberate tracking on capitals (+0.08em to +0.15em) and maintain clear optical hierarchy between primary title lines and subordinate annotations.`.trim();
  } else {
    typographySection = 'Natural typographic hierarchy and letterform balance calibrated dynamically for legibility and aesthetic cohesion.';
  }

  // 7. Composition & Spatial Layout
  let compositionSection = '';
  if (cleanComposition.length > 0) {
    compositionSection = `Spatial architecture: ${cleanComposition.join(', ')}. Anchor the primary focal point deliberately, respecting negative space margins to give the composition breathability. Avoid edge crowding or haphazard floating elements.`;
  } else {
    compositionSection = 'Unconstrained composition; allow graphic elements and typography to find their most natural spatial balance with generous breathing room.';
  }

  // 8. Color Strategy & Palette
  let colorSection = '';
  if (!isColorUnspecified) {
    colorSection = `Color strategy: ${colorStrategy}. Primary palette: ${palette}.`;
    if (customColorNotes.trim()) {
      colorSection += ` Specific notes: ${customColorNotes.trim()}.`;
    }
    colorSection += ` Emphasize rich, saturated ink tones against a natural substrate. Avoid electric neon saturation, harsh RGB clipping, or chaotic rainbow gradients.`;
  } else {
    colorSection = 'Open color direction; select a tasteful, cohesive ink palette that naturally complements the thematic subject and substrate.';
    if (customColorNotes.trim()) {
      colorSection += ` Custom color notes: ${customColorNotes.trim()}.`;
    }
  }

  // 9. Concept & Intellectual Hook
  let conceptSection = '';
  if (cleanConcepts.length > 0) {
    conceptSection = `Conceptual resonance: ${cleanConcepts.join(', ')}. The piece should communicate with subtle wit or quiet gravitas, appealing to thoughtful observers who appreciate nuance over loud slogan shouting.`;
  } else {
    conceptSection = 'Understated conceptual tone that lets visual craftsmanship and thematic subject carry the narrative.';
  }

  // 10. Design DNA Integration
  let dnaSection = 'Design DNA: Inactive.';
  if (useDesignDna && dna) {
    const influenceDescription =
      dnaInfluence === 'Strong'
        ? 'Strict adherence. Every principle of the creator’s Design DNA must strictly govern typography, spatial bounds, and color balance.'
        : dnaInfluence === 'Subtle'
        ? 'Subtle guidance. Apply a gentle atmospheric nod to the creator’s recurring habits without overriding specific brief selections.'
        : 'Balanced integration. Harmonize the user’s brief selections with the recurring rules of the creator’s Design DNA.';

    const dnaTraits: string[] = [];
    if (dna.philosophy) dnaTraits.push(`Core Philosophy: "${dna.philosophy}"`);
    if (dna.typography?.length) {
      dnaTraits.push(`Typography Habit: ${dna.typography.map((t) => t.trait).join('; ')}`);
    }
    if (dna.composition?.length) {
      dnaTraits.push(`Composition Habit: ${dna.composition.map((t) => t.trait).join('; ')}`);
    }
    if (dna.color?.length) {
      dnaTraits.push(`Palette Habit: ${dna.color.map((t) => t.trait).join('; ')}`);
    }
    if (dna.avoid?.length) {
      dnaTraits.push(`DNA Anti-Patterns: Never include ${dna.avoid.slice(0, 4).join(', ')}`);
    }

    dnaSection = `Design DNA: ACTIVE (${dnaInfluence} Influence).\n${influenceDescription}\n${dnaTraits.join('\n')}`;
  }

  // 11. Reference Guidance
  let referenceSection = 'None specified.';
  if (references && references.length > 0) {
    const refDescriptions = references
      .map((ref) => {
        const item = libraryDesigns.find((d) => d.id === ref.designId);
        const name = item ? item.name : 'Library Reference';
        const borrowed = ref.borrowedAspects.length > 0 ? ref.borrowedAspects.join(', ') : 'General Aesthetic';
        return `• Reference "${name}": Extract principles of [${borrowed}]. CRITICAL: Extract the underlying structural rules and visual grammar ONLY. Do NOT replicate any distinctive illustration, copyrighted artwork, or exact literal copy. Translate the inspiration into an original piece for "${
          subject.trim() || 'this concept'
        }".`;
      })
      .join('\n');

    referenceSection = `The following designs from the personal library serve as structural inspiration:\n${refDescriptions}`;
  }

  // 12. Important Constraints & Banned Tropes
  const constraints = [
    'No cheap clipart or low-resolution bitmap artifacts',
    'No AI-hallucinated pseudo-letters, illegible gibberish text, or broken glyphs',
    'No 3D shiny balloon gradients, chrome plastic bevels, or tacky lens flares',
    'Ensure clear figure-ground separation with high print readability',
    'Keep garment mockups or framing elegant, flat, and focused on the graphic art',
  ];

  return `### Creative Direction
${creativeDirection}

### Product
${productNotes}

### Subject
${subjectSection}

### Design Type
${designTypeSection}

### Visual Style
${visualStyleSection}

### Typography
${typographySection}

### Composition
${compositionSection}

### Color
${colorSection}

### Concept
${conceptSection}

### Design DNA
${dnaSection}

### Reference Guidance
${referenceSection}

### Important Constraints
${constraints.map((c) => `• ${c}`).join('\n')}`;
}
