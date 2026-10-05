import { SampleProduct } from '../types';

// Helper to convert SVG markup to base64 Data URL
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

const notebookSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="nb-bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#edf2f7"/>
    </radialGradient>
    <linearGradient id="book-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14213d"/>
      <stop offset="60%" stop-color="#0b132b"/>
      <stop offset="100%" stop-color="#080e1d"/>
    </linearGradient>
    <linearGradient id="gold-foil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fad074"/>
      <stop offset="40%" stop-color="#e0a944"/>
      <stop offset="70%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#c69225"/>
    </linearGradient>
    <filter id="book-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.16"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#nb-bg)"/>

  <!-- Soft Shadow -->
  <rect x="220" y="140" width="370" height="520" rx="16" fill="black" opacity="0.08" filter="blur(20px)"/>

  <!-- Notebook Body -->
  <g filter="url(#book-shadow)">
    <!-- Book Cover -->
    <rect x="215" y="130" width="370" height="540" rx="14" fill="url(#book-grad)" stroke="#202e4c" stroke-width="1.5"/>
    
    <!-- Spine Line -->
    <line x1="245" y1="130" x2="245" y2="670" stroke="#060a14" stroke-width="3" opacity="0.7"/>
    <line x1="247" y1="130" x2="247" y2="670" stroke="#253555" stroke-width="1.5" opacity="0.6"/>

    <!-- Gold Foil Celestial Graphics -->
    <!-- Orbit Rings -->
    <circle cx="410" cy="360" r="125" fill="none" stroke="url(#gold-foil)" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.85"/>
    <ellipse cx="410" cy="360" rx="140" ry="60" fill="none" stroke="url(#gold-foil)" stroke-width="1" opacity="0.75" transform="rotate(-25 410 360)"/>
    <ellipse cx="410" cy="360" rx="140" ry="60" fill="none" stroke="url(#gold-foil)" stroke-width="1" opacity="0.75" transform="rotate(25 410 360)"/>
    <circle cx="410" cy="360" r="75" fill="none" stroke="url(#gold-foil)" stroke-width="1.5"/>
    <circle cx="410" cy="360" r="30" fill="url(#gold-foil)" opacity="0.9"/>
    
    <!-- Sunburst Radii -->
    <g stroke="url(#gold-foil)" stroke-width="1.2" opacity="0.85">
      <line x1="410" y1="265" x2="410" y2="280"/>
      <line x1="410" y1="440" x2="410" y2="455"/>
      <line x1="315" y1="360" x2="330" y2="360"/>
      <line x1="490" y1="360" x2="505" y2="360"/>
      <line x1="343" y1="293" x2="354" y2="304"/>
      <line x1="466" y1="416" x2="477" y2="427"/>
      <line x1="477" y1="293" x2="466" y2="304"/>
      <line x1="354" y1="416" x2="343" y2="427"/>
    </g>

    <!-- Constellation Stars -->
    <circle cx="320" cy="230" r="3.5" fill="url(#gold-foil)"/>
    <circle cx="345" cy="210" r="2.5" fill="url(#gold-foil)"/>
    <circle cx="380" cy="225" r="3" fill="url(#gold-foil)"/>
    <line x1="320" y1="230" x2="345" y2="210" stroke="url(#gold-foil)" stroke-width="0.8" opacity="0.6"/>
    <line x1="345" y1="210" x2="380" y2="225" stroke="url(#gold-foil)" stroke-width="0.8" opacity="0.6"/>

    <circle cx="460" cy="485" r="3.5" fill="url(#gold-foil)"/>
    <circle cx="500" cy="470" r="2.5" fill="url(#gold-foil)"/>
    <line x1="460" y1="485" x2="500" y2="470" stroke="url(#gold-foil)" stroke-width="0.8" opacity="0.6"/>

    <!-- Gold Text -->
    <text x="410" y="540" font-family="'Cormorant Garamond', Georgia, serif" font-size="16" letter-spacing="6" fill="url(#gold-foil)" text-anchor="middle" font-weight="600">CELESTIAL ATLAS</text>
    <text x="410" y="562" font-family="sans-serif" font-size="9" letter-spacing="4" fill="url(#gold-foil)" text-anchor="middle" opacity="0.85">SCIENCE OF GIFTS • VOL. I</text>

    <!-- Silk Bookmark Ribbon -->
    <path d="M 405 670 L 405 730 L 413 718 L 421 730 L 421 670 Z" fill="#d97706" opacity="0.95"/>

    <!-- Elastic Band -->
    <rect x="525" y="128" width="22" height="544" rx="2" fill="#0b172a" stroke="#1f2d48" stroke-width="1"/>
    <line x1="527" y1="128" x2="527" y2="672" stroke="#2c3e5f" stroke-width="0.75" opacity="0.6"/>
  </g>
</svg>
`;

const mugSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="mug-bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </radialGradient>
    <linearGradient id="ceramic-shading" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="12%" stop-color="#f8fafc"/>
      <stop offset="55%" stop-color="#ffffff"/>
      <stop offset="90%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="cyan-cobalt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
    <filter id="mug-shadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="8" dy="24" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#mug-bg)"/>

  <!-- Soft Table Shadow -->
  <ellipse cx="400" cy="620" rx="190" ry="32" fill="#0f172a" opacity="0.12" filter="blur(18px)"/>

  <g filter="url(#mug-shadow)">
    <!-- Mug Handle -->
    <path d="M 480 300 C 585 300 595 480 480 490 L 480 445 C 540 435 535 345 480 340 Z" fill="#eef2f6" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Mug Cylinder Body -->
    <path d="M 270 240 L 490 240 L 485 580 C 485 605 275 605 275 580 Z" fill="url(#ceramic-shading)" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Mug Rim & Inner Cavity -->
    <ellipse cx="380" cy="240" rx="110" ry="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <ellipse cx="380" cy="242" rx="98" ry="18" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Subtle Ceramic Highlight Reflection -->
    <rect x="315" y="260" width="16" height="310" rx="8" fill="white" opacity="0.6"/>

    <!-- Fibonacci Graphic on Mug -->
    <g transform="translate(375, 410) scale(0.85)">
      <!-- Golden Spiral -->
      <path d="M 0 0 A 10 10 0 0 1 10 10 A 20 20 0 0 1 -10 30 A 40 40 0 0 1 -50 -10 A 70 70 0 0 1 20 -80 A 110 110 0 0 1 130 30" fill="none" stroke="url(#cyan-cobalt)" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Fibonacci Boxes Outline -->
      <rect x="-10" y="10" width="20" height="20" fill="none" stroke="#0f766e" stroke-width="1" opacity="0.4"/>
      <rect x="-50" y="-10" width="40" height="40" fill="none" stroke="#0f766e" stroke-width="1" opacity="0.4"/>
      <rect x="-50" y="-80" width="70" height="70" fill="none" stroke="#0f766e" stroke-width="1" opacity="0.4"/>
      
      <circle cx="0" cy="0" r="3" fill="#0284c7"/>
    </g>

    <!-- Formula Text -->
    <text x="380" y="525" font-family="'Cormorant Garamond', Georgia, serif" font-size="14" font-style="italic" fill="#0f766e" text-anchor="middle">φ = (1 + √5) / 2 = 1.618...</text>
    <text x="380" y="546" font-family="sans-serif" font-size="8" letter-spacing="3" fill="#64748b" text-anchor="middle" font-weight="600">SCIENCE OF GIFTS</text>
  </g>
</svg>
`;

const tshirtSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="tee-bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </radialGradient>
    <linearGradient id="cotton-tone" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <filter id="tee-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#tee-bg)"/>

  <!-- Ambient Shadow -->
  <path d="M 230 180 L 570 180 L 640 310 L 560 350 L 550 670 L 250 670 L 240 350 L 160 310 Z" fill="#0f172a" opacity="0.1" filter="blur(24px)"/>

  <g filter="url(#tee-shadow)">
    <!-- T-Shirt Fabric Body -->
    <path d="M 330 155 Q 400 195 470 155 L 590 200 L 650 320 L 575 365 L 545 325 L 550 670 L 250 670 L 255 325 L 225 365 L 150 320 L 210 200 Z" fill="url(#cotton-tone)" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Collar Band -->
    <path d="M 330 155 Q 400 205 470 155 Q 400 185 330 155 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.2"/>
    <path d="M 345 152 Q 400 142 455 152" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>

    <!-- Sleeve Seams -->
    <line x1="255" y1="325" x2="210" y2="200" stroke="#cbd5e1" stroke-width="1.5"/>
    <line x1="545" y1="325" x2="590" y2="200" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Subtle Natural Fabric Folds -->
    <path d="M 270 420 Q 320 440 300 560" fill="none" stroke="#e2e8f0" stroke-width="2.5" opacity="0.7"/>
    <path d="M 530 410 Q 480 435 500 570" fill="none" stroke="#e2e8f0" stroke-width="2.5" opacity="0.7"/>

    <!-- Artwork on T-Shirt: Galileo Telescope & Moon Phases -->
    <g transform="translate(400, 390)">
      <!-- Central Graphic Frame -->
      <circle cx="0" cy="0" r="85" fill="none" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="80" fill="none" stroke="#1e293b" stroke-width="0.8" stroke-dasharray="3,3"/>

      <!-- Moon Phases Orbit -->
      <!-- New Moon -->
      <circle cx="-50" cy="0" r="10" fill="#1e293b"/>
      <!-- Crescent -->
      <path d="M -25 -25 A 10 10 0 0 1 -25 -5 A 6 6 0 0 0 -25 -25 Z" fill="#1e293b"/>
      <!-- Full Moon -->
      <circle cx="0" cy="-50" r="10" fill="none" stroke="#1e293b" stroke-width="1.5"/>
      <!-- Gibbous -->
      <circle cx="50" cy="0" r="10" fill="#1e293b"/>
      <circle cx="48" cy="0" r="8" fill="#f8fafc"/>

      <!-- Telescope Engraving Lineart in Center -->
      <line x1="-35" y1="20" x2="35" y2="-20" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
      <rect x="-42" y="16" width="14" height="8" rx="2" fill="#0f766e" transform="rotate(-30 -35 20)"/>
      <rect x="28" y="-24" width="18" height="10" rx="2" fill="#0f766e" transform="rotate(-30 35 -20)"/>
      <!-- Tripod -->
      <line x1="0" y1="0" x2="-20" y2="45" stroke="#1e293b" stroke-width="1.2"/>
      <line x1="0" y1="0" x2="20" y2="45" stroke="#1e293b" stroke-width="1.2"/>
      <line x1="0" y1="0" x2="0" y2="45" stroke="#1e293b" stroke-width="1.2"/>

      <!-- Typography -->
      <text x="0" y="115" font-family="'Cormorant Garamond', Georgia, serif" font-size="16" letter-spacing="5" fill="#1e293b" text-anchor="middle" font-weight="600">SIDEREUS NUNCIUS</text>
      <text x="0" y="132" font-family="sans-serif" font-size="8" letter-spacing="3" fill="#64748b" text-anchor="middle">GALILEO 1610 • SCIENCE OF GIFTS</text>
    </g>
  </g>
</svg>
`;

const bottleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="bot-bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#edf2f7"/>
    </radialGradient>
    <linearGradient id="matte-metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="25%" stop-color="#475569"/>
      <stop offset="60%" stop-color="#64748b"/>
      <stop offset="85%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="cap-wood" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <filter id="bot-shadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="6" dy="24" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.16"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#bot-bg)"/>

  <!-- Floor Shadow -->
  <ellipse cx="400" cy="690" rx="100" ry="22" fill="#0f172a" opacity="0.16" filter="blur(16px)"/>

  <g filter="url(#bot-shadow)">
    <!-- Wooden Cap with Metal Loop -->
    <path d="M 370 110 C 370 95 430 95 430 110 L 425 125 L 375 125 Z" fill="none" stroke="#94a3b8" stroke-width="4"/>
    <rect x="365" y="125" width="70" height="35" rx="6" fill="url(#cap-wood)" stroke="#78350f" stroke-width="1"/>
    <rect x="372" y="160" width="56" height="20" fill="#94a3b8"/>

    <!-- Bottle Neck -->
    <path d="M 370 180 L 430 180 L 450 250 L 350 250 Z" fill="url(#matte-metal)"/>

    <!-- Bottle Main Body -->
    <rect x="340" y="248" width="120" height="430" rx="16" fill="url(#matte-metal)" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Highlight Strip for Cylindrical Depth -->
    <rect x="365" y="255" width="8" height="415" rx="4" fill="white" opacity="0.15"/>

    <!-- Laser Etched Graphic: Quantum Wave Function -->
    <g transform="translate(400, 440)">
      <!-- Wave oscillations -->
      <path d="M -45 0 Q -25 -35 0 0 T 45 0" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.9"/>
      <path d="M -45 0 Q -25 35 0 0 T 45 0" fill="none" stroke="#a7f3d0" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.8"/>
      
      <!-- Coordinate Axes -->
      <line x1="-50" y1="0" x2="50" y2="0" stroke="#94a3b8" stroke-width="0.8" opacity="0.5"/>
      <line x1="0" y1="-45" x2="0" y2="45" stroke="#94a3b8" stroke-width="0.8" opacity="0.5"/>

      <!-- Formula -->
      <text x="0" y="70" font-family="'Cormorant Garamond', Georgia, serif" font-size="14" font-style="italic" fill="#e2e8f0" text-anchor="middle">iℏ ∂/∂t Ψ = Ĥ Ψ</text>
      <text x="0" y="92" font-family="sans-serif" font-size="7" letter-spacing="3" fill="#94a3b8" text-anchor="middle" font-weight="600">SCIENCE OF GIFTS • 750 ML</text>
    </g>
  </g>
</svg>
`;

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'sample-notebook',
    title: 'Celestial Atlas Hardcover Journal',
    category: 'notebook',
    description: 'Gold foil constellation diagram on deep midnight blue linen with silk bookmark ribbon & elastic closure.',
    imageUrl: svgToDataUrl(notebookSvg),
    recommendedSettings: {
      productType: 'notebook',
      orientation: 'flat-lay',
      background: 'gradient-wall-neutral-surface',
      surface: 'editorial-tabletop',
      props: 'subtle-historical',
      aspectRatio: '1:1',
      additionalInstructions: 'Emphasize the rich metallic gold foil reflection against the deep midnight blue linen cover.',
    },
  },
  {
    id: 'sample-mug',
    title: 'Fibonacci Golden Spiral Ceramic Mug',
    category: 'mug',
    description: 'Minimalist white ceramic mug featuring geometric logarithmic spiral and golden ratio constant.',
    imageUrl: svgToDataUrl(mugSvg),
    recommendedSettings: {
      productType: 'mug',
      orientation: 'upright',
      background: 'science-gradient',
      surface: 'light-stone',
      props: 'minimal-subtle',
      aspectRatio: '1:1',
      additionalInstructions: 'Crisp focus on the mathematical spiral curves and clean ceramic rim.',
    },
  },
  {
    id: 'sample-tshirt',
    title: 'Sidereus Nuncius Galileo Tee',
    category: 'tshirt',
    description: 'Vintage heather cotton t-shirt with historical telescope schematic and 1610 lunar observations.',
    imageUrl: svgToDataUrl(tshirtSvg),
    recommendedSettings: {
      productType: 'tshirt',
      orientation: 'folded',
      background: 'neutral-editorial',
      surface: 'editorial-tabletop',
      props: 'books-ephemera',
      aspectRatio: '4:5',
      additionalInstructions: 'Neat boutique folding displaying the full Galileo telescope and lunar phase illustration.',
    },
  },
  {
    id: 'sample-bottle',
    title: 'Quantum Wave Vacuum Flask',
    category: 'waterBottle',
    description: 'Matte slate insulated stainless steel flask with laser-etched Schrödinger wave mechanics.',
    imageUrl: svgToDataUrl(bottleSvg),
    recommendedSettings: {
      productType: 'waterBottle',
      orientation: 'upright',
      background: 'blue-wall-neutral-surface',
      surface: 'light-stone',
      props: 'none',
      aspectRatio: '4:5',
      additionalInstructions: 'Sleek specular highlight along the matte powder-coat cylinder with bamboo wood cap detail.',
    },
  },
];
