import { DesignItem, DesignDna } from '../types';

// Helper to convert SVG to data URL
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Solitude Definition Tee (Minimalist Typography)
const svgSolitude = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <rect width="600" height="600" fill="#F4F1EA"/>
  <rect x="60" y="60" width="480" height="480" fill="none" stroke="#222222" stroke-width="1.5" stroke-opacity="0.15"/>
  <g transform="translate(100, 190)">
    <text x="0" y="0" font-family="'Source Serif 4', Georgia, serif" font-size="44" font-weight="600" fill="#1C1B18" letter-spacing="4">SOLITUDE</text>
    <text x="0" y="32" font-family="'JetBrains Mono', monospace" font-size="14" fill="#66645E" letter-spacing="1.5">/ noun · [ˈsɒl.ɪ.tjuːd] /</text>
    <line x1="0" y1="52" x2="400" y2="52" stroke="#1C1B18" stroke-width="1.5"/>
    <text x="0" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="17" fill="#2E2C28" font-weight="400" line-height="1.6">
      <tspan x="0" dy="0">1. The quiet sanctuary where original thoughts take shape</tspan>
      <tspan x="0" dy="28">and fleeting noise dissolves into enduring clarity.</tspan>
      <tspan x="0" dy="36">2. An intentional absence of distraction, not the</tspan>
      <tspan x="0" dy="28">presence of isolation.</tspan>
    </text>
    <g transform="translate(0, 220)">
      <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="11" fill="#88847C" letter-spacing="2">EDITION 01 — ARCHIVAL APPAREL SERIES</text>
      <text x="350" y="0" font-family="'JetBrains Mono', monospace" font-size="11" fill="#88847C" text-anchor="end">45°N / 122°W</text>
    </g>
  </g>
</svg>
`;

// 2. Desert 500 Vintage Moto Racing Club Badge
const svgDesertMoto = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <rect width="600" height="600" fill="#EAE4D9"/>
  <!-- Distressed circle badge -->
  <circle cx="300" cy="300" r="230" fill="none" stroke="#253549" stroke-width="6" stroke-dasharray="8 4"/>
  <circle cx="300" cy="300" r="214" fill="#253549"/>
  <circle cx="300" cy="300" r="206" fill="none" stroke="#EAE4D9" stroke-width="2"/>
  
  <!-- Curved text banner imitation -->
  <text x="300" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="800" fill="#EAE4D9" text-anchor="middle" letter-spacing="6">DESERT 500</text>
  <text x="300" y="195" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#C97A52" text-anchor="middle" letter-spacing="4">ENDURANCE RUN · 1968</text>
  
  <!-- Central winged piston graphic -->
  <g transform="translate(300, 310)">
    <polygon points="-70,-40 -120,-80 -140,-50 -70,-15" fill="#EAE4D9" opacity="0.9"/>
    <polygon points="70,-40 120,-80 140,-50 70,-15" fill="#EAE4D9" opacity="0.9"/>
    <!-- Piston head -->
    <rect x="-35" y="-55" width="70" height="65" rx="6" fill="#EAE4D9"/>
    <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#253549" stroke-width="3"/>
    <line x1="-30" y1="-25" x2="30" y2="-25" stroke="#253549" stroke-width="3"/>
    <rect x="-18" y="10" width="36" height="50" rx="3" fill="#EAE4D9"/>
    <circle cx="0" cy="55" r="14" fill="#253549"/>
    <circle cx="0" cy="55" r="7" fill="#EAE4D9"/>
  </g>
  
  <text x="300" y="420" font-family="'Source Serif 4', serif" font-size="18" font-style="italic" fill="#EAE4D9" text-anchor="middle">Mojave High Desert Chapter</text>
  <line x1="200" y1="440" x2="400" y2="440" stroke="#C97A52" stroke-width="2"/>
  <text x="300" y="465" font-family="'JetBrains Mono', monospace" font-size="12" fill="#EAE4D9" text-anchor="middle" letter-spacing="3">AUTHENTIC MOTOR GOODS</text>
</svg>
`;

// 3. Ginkgo Biloba Botanical Specimen (Linocut Style)
const svgBotanical = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <rect width="600" height="600" fill="#F8F6F0"/>
  <rect x="40" y="40" width="520" height="520" fill="none" stroke="#2D4030" stroke-width="2"/>
  <rect x="48" y="48" width="504" height="504" fill="none" stroke="#2D4030" stroke-width="0.75"/>
  
  <!-- Heading header -->
  <text x="300" y="105" font-family="'Source Serif 4', Georgia, serif" font-size="28" font-weight="600" fill="#2D4030" text-anchor="middle" letter-spacing="3">GINKGO BILOBA</text>
  <text x="300" y="130" font-family="'Source Serif 4', Georgia, serif" font-size="15" font-style="italic" fill="#6B7C66" text-anchor="middle">Fam. Ginkgoaceae · Folium Antiquum</text>
  <line x1="220" y1="145" x2="380" y2="145" stroke="#2D4030" stroke-width="1"/>

  <!-- Linocut Ginkgo Leaf Pair -->
  <g transform="translate(300, 290)">
    <!-- Stem -->
    <path d="M-10,130 Q10,50 0,-10" fill="none" stroke="#2D4030" stroke-width="4" stroke-linecap="round"/>
    <!-- Left Leaf -->
    <path d="M-5,10 C-60,0 -130,-40 -120,-110 C-110,-140 -70,-150 -40,-130 C-30,-120 -15,-100 -5,10 Z" fill="#2D4030"/>
    <path d="M-10,0 C-40,-50 -90,-80 -100,-115" stroke="#F8F6F0" stroke-width="1.5" fill="none"/>
    <path d="M-10,0 C-30,-60 -65,-95 -75,-125" stroke="#F8F6F0" stroke-width="1.5" fill="none"/>
    <path d="M-10,0 C-20,-65 -45,-100 -50,-125" stroke="#F8F6F0" stroke-width="1.5" fill="none"/>
    <!-- Right Leaf -->
    <path d="M5,25 C60,15 135,-20 130,-90 C125,-125 85,-140 50,-120 C35,-110 20,-85 5,25 Z" fill="#2D4030"/>
    <path d="M10,15 C45,-40 95,-70 110,-100" stroke="#F8F6F0" stroke-width="1.5" fill="none"/>
    <path d="M10,15 C35,-50 70,-80 85,-110" stroke="#F8F6F0" stroke-width="1.5" fill="none"/>
    <path d="M10,15 C25,-55 50,-85 60,-115" stroke="#F8F6F0" stroke-width="1.5" fill="none"/>
  </g>
  
  <text x="300" y="475" font-family="'JetBrains Mono', monospace" font-size="12" fill="#2D4030" text-anchor="middle" letter-spacing="3">HERBARIUM SPECIMEN NO. 14</text>
  <text x="300" y="500" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#6B7C66" text-anchor="middle">Archival Linoleum Cut Block Print on 300gsm Rag</text>
</svg>
`;

// 4. Celestial Meridian / Astronomical Society Crest
const svgCelestial = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <rect width="600" height="600" fill="#131B2A"/>
  
  <!-- Outer gold double border -->
  <circle cx="300" cy="300" r="225" fill="none" stroke="#D4AF37" stroke-width="2"/>
  <circle cx="300" cy="300" r="215" fill="none" stroke="#D4AF37" stroke-width="1" stroke-dasharray="3 3"/>
  <circle cx="300" cy="300" r="160" fill="none" stroke="#D4AF37" stroke-width="1.5"/>

  <!-- Orbital rings -->
  <ellipse cx="300" cy="300" rx="140" ry="60" fill="none" stroke="#E2E8F0" stroke-width="1.5" stroke-opacity="0.6" transform="rotate(-25 300 300)"/>
  <ellipse cx="300" cy="300" rx="140" ry="60" fill="none" stroke="#E2E8F0" stroke-width="1.5" stroke-opacity="0.6" transform="rotate(35 300 300)"/>
  <circle cx="300" cy="300" r="26" fill="#D4AF37"/>
  <circle cx="300" cy="300" r="18" fill="#131B2A"/>
  <circle cx="300" cy="300" r="8" fill="#D4AF37"/>

  <!-- Surrounding stars -->
  <circle cx="230" cy="240" r="3" fill="#E2E8F0"/>
  <circle cx="380" cy="250" r="2.5" fill="#E2E8F0"/>
  <circle cx="340" cy="370" r="3" fill="#E2E8F0"/>
  <circle cx="260" cy="360" r="2" fill="#E2E8F0"/>

  <text x="300" y="115" font-family="'Source Serif 4', Georgia, serif" font-size="20" font-weight="600" fill="#D4AF37" text-anchor="middle" letter-spacing="4">AD ASTRA PER ASPERA</text>
  <text x="300" y="495" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#E2E8F0" text-anchor="middle" letter-spacing="5">ASTRONOMICAL GUILD · EST. 1894</text>
</svg>
`;

export const INITIAL_DESIGNS: DesignItem[] = [
  {
    id: 'design_solitude_def',
    name: 'Solitude / Definition Tee',
    category: 'T-shirt',
    type: 'Apparel',
    source: 'My Design',
    tags: ['Typography', 'Definition', 'Minimalist', 'Editorial'],
    influence: 'High',
    imageUrl: svgToDataUrl(svgSolitude),
    analysisStatus: 'analyzed',
    createdAt: '2026-03-28T14:20:00Z',
    analysis: {
      designType: 'T-shirt Graphic',
      visualCharacteristics: {
        typography: 'Disciplined contrast pairing of classic literary serif headline with monospace pronunciation key and clean geometric sans body definitions.',
        composition: 'Left-aligned Swiss modernist block inside a subtle hairline bounding frame, positioned across upper-chest with ample surrounding quiet field.',
        colorPalette: 'Muted bone/cream textile ground with deep charcoal-black ink (#1C1B18) and quiet taupe secondary metadata lines.',
        illustration: 'Purely typography-driven; reliance on typographic rhythm, rule lines, and punctuation geometry rather than figurative illustration.',
        layout: 'Compact upper-chest rectangular placement maintaining rigorous vertical grid discipline.',
        visualHierarchy: 'First lead: bold uppercase "SOLITUDE" headline. Second: horizontal rule line and phonetic transcription. Third: numbered definitions. Fourth: subtle micro-coordinates footer.',
        negativeSpace: 'High negative space discipline (over 65% unprinted field), creating an unhurried, cerebral atmosphere.',
        symmetry: 'Asymmetrical left-aligned structure balanced by the subtle bounding border.',
        density: 'Disciplined and breathable; generous line-height avoids textbook crowding.',
      },
      conceptualCharacteristics: {
        subject: 'Philosophical reframing of solitude as productive creative sanctuary.',
        concept: 'Transforming a dictionary definition into wearable intellectual identity.',
        tone: 'Quietly confident, introspective, cerebral, and understated.',
        humor: 'Earnest and reflective; avoids irony or meme references.',
        emotionalQuality: 'Calm, contemplative, grounded, and literary.',
        intendedAudience: 'Writers, architects, designers, deep thinkers, and minimalist apparel collectors.',
        communicationApproach: 'Definition format: establishing authority and quiet intellectual kinship.',
      },
      techniques: [
        'Definition format with pronunciation key',
        'Swiss modernist grid alignment',
        'Hairline border framing',
        'Serif and Monospace pairing',
        'Generous negative space isolation',
      ],
      whyItWorks:
        'It elevates a t-shirt into an intellectual statement piece. By avoiding loud illustrative distractions, the design relies on impeccable typographic craft and generous negative space to signal refined discernment.',
      distinctiveCharacteristics: [
        'Strict literary serif paired with phonetic pronunciation key',
        'Understated, unhurried negative space ratio',
        'Monochrome charcoal ink on natural unbleached cotton',
      ],
      analyzedAt: '2026-03-28T14:22:15Z',
    },
  },
  {
    id: 'design_desert_moto',
    name: 'Desert 500 / Endurance Club',
    category: 'T-shirt',
    type: 'Apparel',
    source: 'Inspiration',
    tags: ['Vintage', 'Badge', 'Emblem', 'Screen Print', 'Americana'],
    influence: 'High',
    imageUrl: svgToDataUrl(svgDesertMoto),
    analysisStatus: 'analyzed',
    createdAt: '2026-03-29T10:15:00Z',
    analysis: {
      designType: 'T-shirt Back Graphic / Emblem',
      visualCharacteristics: {
        typography: 'Hand-drawn condensed sans-serif block headers with curved arched pathing, paired with italicized secondary serif and technical monospace.',
        composition: 'Centered circular emblem with concentric dashed borders and a strong winged mechanical piston focal anchor.',
        colorPalette: 'Three-tone palette: washed navy (#253549), sun-bleached desert sand (#EAE4D9), and warm terracotta/rust accent (#C97A52).',
        illustration: 'Stylized flat geometric winged piston with mechanical cross-sectioning and clean silhouette lines.',
        layout: 'Large circular badge intended for full back or prominent front chest print.',
        visualHierarchy: 'Primary: central circular badge silhouette and winged piston. Secondary: arched "DESERT 500" header. Tertiary: chapter subtitle and date rule.',
        negativeSpace: 'Contained density within the circular badge, but with clean separation between concentric concentric rings.',
        symmetry: 'Bilateral horizontal symmetry around the central vertical axis.',
        density: 'Moderate badge density with structured compartmentalization.',
      },
      conceptualCharacteristics: {
        subject: '1960s vintage motorcycle desert endurance racing culture.',
        concept: 'Fictional heritage motoring club badge conveying rugged camaraderie and mechanical authenticity.',
        tone: 'Rugged, nostalgic, gritty yet curated, mid-century Americana.',
        humor: 'Earnest heritage tribute.',
        emotionalQuality: 'Evocative of desert wind, vintage gasoline engines, and open road freedom.',
        intendedAudience: 'Motorcycle enthusiasts, heritage streetwear fans, and vintage Americana collectors.',
        communicationApproach: 'Emblem/Badge format: conferring membership in an exclusive subcultural heritage.',
      },
      techniques: [
        'Circular club badge / heraldic composition',
        'Winged mechanical motif',
        'Weathered three-tone color separation',
        'Arched condensed typography',
        'Dashed outline stitch detailing',
      ],
      whyItWorks:
        'The design balances authentic vintage racing insignia tropes with clean modern vector discipline, avoiding over-cluttered biker clichés while maintaining authentic mechanical grit.',
      distinctiveCharacteristics: [
        'Concentric dashed badge framing with terracotta divider',
        'Stylized mechanical winged piston emblem',
        'Weathered navy and warm sand ink contrast',
      ],
      analyzedAt: '2026-03-29T10:18:40Z',
    },
  },
  {
    id: 'design_botanical_ginkgo',
    name: 'Ginkgo Biloba / Botanical Specimen',
    category: 'Poster',
    type: 'Print',
    source: 'Inspiration',
    tags: ['Linocut', 'Woodcut', 'Botanical', 'Editorial', 'Academic'],
    influence: 'Medium',
    imageUrl: svgToDataUrl(svgBotanical),
    analysisStatus: 'unanalyzed',
    createdAt: '2026-03-30T09:00:00Z',
  },
  {
    id: 'design_celestial_meridian',
    name: 'Celestial Meridian / Guild Crest',
    category: 'Hoodie',
    type: 'Apparel',
    source: 'My Design',
    tags: ['Collegiate', 'Academic', 'Symbolic', 'Astronomy'],
    influence: 'High',
    imageUrl: svgToDataUrl(svgCelestial),
    analysisStatus: 'unanalyzed',
    createdAt: '2026-03-30T11:45:00Z',
  },
];

export const INITIAL_DESIGN_DNA: DesignDna = {
  typography: [
    {
      id: 'dna_typo_1',
      trait: 'Literary Serif & Clean Sans / Monospace Hierarchy',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Prefers pairing high-character serifs for primary titular statements with disciplined sans or monospace for scientific/phonetic sub-lines.',
    },
    {
      id: 'dna_typo_2',
      trait: 'Disciplined Tracking & Letterspacing',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'All-caps lead words and metadata lines utilize generous tracking (+0.1em to +0.2em) to ensure crisp micro-legibility on fabric.',
    },
  ],
  composition: [
    {
      id: 'dna_comp_1',
      trait: 'Structured Framing & Geometric Bounds',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Compositions either anchor within subtle hairline rectangular boundaries or circular badge containers, preventing unruly edge bleed.',
    },
    {
      id: 'dna_comp_2',
      trait: 'Intentional Negative Space Preservation',
      strength: 'Strong preference across personal works',
      observation:
        'Reserves at least 50% breathing room around graphic anchors, creating calm editorial weight.',
    },
  ],
  color: [
    {
      id: 'dna_color_1',
      trait: 'Limited 1-to-3 Tone Pigment Palettes',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Rejects neon or hyper-saturated gradients. Strictly favors organic, ink-friendly pairings: deep charcoal, unbleached cream, washed navy, and terracotta.',
    },
    {
      id: 'dna_color_2',
      trait: 'Unbleached Organic Garment Grounds',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Preference for warm cream, bone white, or washed charcoal canvas over sterile #FFFFFF.',
    },
  ],
  concepts: [
    {
      id: 'dna_concept_1',
      trait: 'Subcultural & Intellectual Kinship',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Designs act as quiet signifiers of shared passions (literature, philosophical introspection, heritage mechanics) rather than loud self-promotion.',
    },
  ],
  tone: [
    {
      id: 'dna_tone_1',
      trait: 'Understated, Cerebral, and Earnest',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Total avoidance of cheap sarcasm or internet memes. Projects measured confidence, craftsmanship, and quiet authority.',
    },
  ],
  techniques: [
    {
      id: 'dna_tech_1',
      trait: 'Definition & Archival Emblems',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Frequently leverages structural devices like dictionary definitions, technical cross-sections, and heritage club badges.',
    },
    {
      id: 'dna_tech_2',
      trait: 'Micro-Coordinate & Series Telemetry',
      strength: 'Observed across 2 of 2 analyzed designs',
      observation:
        'Subtle archival details (e.g. edition marks, geographical coordinates, chapter numbers) enhance authenticity.',
    },
  ],
  philosophy:
    'Graphic design should speak with quiet authority rather than volume. By marrying classical typographic discipline with archival formats, each piece becomes a tactile artifact that rewards closer inspection.',
  avoid: [
    'Loud, saturated rainbow gradients and neon glow effects',
    'Edge-to-edge crowded clutter without breathing space',
    'Cheap clip-art illustrations or juvenile cartoon tropes',
    'Generic default sans-serif layouts lacking typographic tension',
    'Ironic meme slogans that date within six months',
  ],
  lastUpdated: '2026-03-29T10:20:00Z',
  basedOnCount: 2,
};
