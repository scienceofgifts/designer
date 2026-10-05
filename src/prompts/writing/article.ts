import {
  ArticleOptions,
  ArticleType,
  ArticleTone,
  ArticleSearchIntent,
} from './types';
import { composeWritingStyleBlocks } from '../../utils/styleManager';
import { WritingStylesConfig } from './styles';

function formatArticleTypeDescription(type: ArticleType): string {
  switch (type) {
    case 'informational':
      return 'Informational Deep Dive — Illuminating historical context, scientific wonder, design craftsmanship, or cultural origins behind meaningful objects and traditions.';
    case 'how-to':
      return 'Actionable How-To Guide — Clear, sequential, beautifully explained steps helping the reader master a gifting ritual, design choice, or thoughtful curation practice.';
    case 'explainer':
      return 'Analytical Explainer — Demystifying a complex or subtle topic (e.g., the science of gratitude, the psychology of gift selection, or how celestial mechanics inspired horology).';
    case 'advice':
      return 'Empathetic Editorial Advice — Thoughtful guidance offering nuanced perspectives on difficult or sensitive gifting dilemmas without condescension.';
    case 'etiquette':
      return 'Modern Gifting Etiquette — Refined, contemporary social guidelines on hosting, recipient reciprocity, milestone recognition, and thank-you customs.';
    case 'problem-solving':
      return 'Problem-Solving Feature — Direct solutions for persistent reader pain points (e.g., long-distance gifting, navigating taste differences, avoiding consumerist waste).';
    default:
      return 'In-depth editorial article.';
  }
}

function formatSearchIntent(intent: ArticleSearchIntent): string {
  switch (intent) {
    case 'informational':
      return 'Informational — Reader is seeking clear answers, deep understanding, and educational insight.';
    case 'commercial-investigation':
      return 'Commercial Investigation — Reader is comparing options, seeking curated recommendations, and making informed buying decisions.';
    case 'how-to-guide':
      return 'Action-Oriented How-To — Reader wants a practical methodology to execute a specific task smoothly.';
    case 'inspiration-ideas':
      return 'Creative Inspiration — Reader is browsing for fresh angles, unexpected perspectives, and aesthetic joy.';
    default:
      return 'Engaged editorial search.';
  }
}

/**
 * Builds the complete prompt for generating a rich, non-generic Article.
 * Automatically incorporates Global + Editorial writing styles.
 */
export function generateArticlePrompt(
  options: ArticleOptions,
  styles?: Partial<WritingStylesConfig>
): string {
  const topic = options.topic.trim() || 'The Lost Art of Intentional Gift Giving';
  const reader = options.intendedReader.trim() || 'Curious, culture-conscious readers interested in history, science, and meaningful design';
  const primaryKw = options.primaryKeyword.trim() ? `• Primary Keyword: "${options.primaryKeyword.trim()}" (Include in H1, early in the introduction, and naturally across 1-2 H2s)` : '• Primary Keyword: Focused on organic topical authority';
  const secondaryKws = options.secondaryKeywords.trim() ? `• Secondary Keywords: ${options.secondaryKeywords.trim()} (Weave seamlessly into body copy)` : '• Secondary Keywords: Rich semantic vocabulary';
  const typeDesc = formatArticleTypeDescription(options.articleType);
  const intentDesc = formatSearchIntent(options.searchIntent);

  const additionalSection = options.additionalInstructions?.trim()
    ? `\nADDITIONAL EDITORIAL INSTRUCTIONS:\n${options.additionalInstructions.trim()}\n`
    : '';

  const styleSection = composeWritingStyleBlocks(
    { includeGlobal: true, includeEditorial: true },
    styles
  );

  return `Long-Form Editorial Article Prompt — Science of Gifts

ROLE & OBJECTIVE:
Act as an acclaimed magazine journalist and essayist writing for "Science of Gifts". Your mission is to write a deeply researched, engaging, and memorable feature article on the requested topic.

The piece must read like a thoughtful piece in The Atlantic, The New Yorker, or Kinfolk—rich with genuine insight, lucid prose, and zero boilerplate SEO filler.

ARTICLE BRIEF:
• Article Topic: ${topic}
• Intended Reader: ${reader}
• Format / Article Type: ${typeDesc}
• Target Search Intent: ${intentDesc}
• Tone of Voice: ${options.tone}
${primaryKw}
${secondaryKws}

REQUIRED EDITORIAL ARCHITECTURE:
1. Compelling Headline & Standfirst:
   - Provide 3 distinct title options (Editorial, Conversational, Search-optimized).
   - Include a 1–2 sentence standfirst / subtitle summarizing the article's core thesis with intellectual flair.

2. Engaging Introduction (200–300 words):
   - Open with an evocative hook: an overlooked historical anecdote, a compelling scientific study, a sensory vignette, or a counterintuitive observation.
   - Avoid generic platitudes ("In today's fast-paced world...").
   - Establish the stakes: why this subject matters for anyone seeking a more deliberate, beautiful life.

3. Structured Body Sections (4–6 Thoughtful Sub-Headings):
   - Break the discussion into logical H2 and H3 sections.
   - Ground arguments in tangible real-world examples, material culture, scientific principles, or historical references.
   - Include at least one "Pull Quote" or emphasized key takeaway that summarizes a cornerstone insight.
   - If applicable to the article type, include actionable advice, bulleted frameworks, or concrete takeaways that readers can implement immediately.

4. Thoughtful Synthesis & Conclusion (150–200 words):
   - Synthesize the core ideas without merely summarizing what was already said.
   - Leave the reader with an uplifting, contemplative perspective on mindfulness, appreciation, and human connection.
${additionalSection}
${styleSection}
OUTPUT FORMAT:
Return the full completed article in clean, beautifully structured Markdown with proper headings, italicized emphasis, and blockquotes for pullouts.`;
}
