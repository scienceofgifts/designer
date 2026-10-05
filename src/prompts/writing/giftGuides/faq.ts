import { GiftGuideFaqOptions, GiftGuideTone } from './types';
import { composeWritingStyleBlocks } from '../../../utils/styleManager';
import { WritingStylesConfig } from '../styles';

function formatToneDescription(tone: GiftGuideTone): string {
  switch (tone) {
    case 'conversational-editorial':
      return 'Conversational Editorial — Smart, articulate, and friendly with natural phrasing.';
    case 'warm-helpful':
      return 'Warm & Helpful — Reassuring, empathetic, and attentive to buyer questions.';
    case 'witty-refined':
      return 'Witty but Refined — Sharp, clever, with subtle dry humor.';
    case 'practical':
      return 'Practical & Actionable — Clear, concise, and focused on logistics, sizing, and usability.';
    case 'informational':
      return 'Informational & Scholarly — Factual, authoritative, and educational.';
    default:
      return 'Helpful and concise.';
  }
}

/**
 * Builds a prompt specifically for generating the FAQ section of a gift guide.
 * Does NOT generate the entire gift guide.
 * Automatically incorporates Global + Editorial writing styles.
 */
export function generateGiftGuideFaqPrompt(
  options: GiftGuideFaqOptions,
  styles?: Partial<WritingStylesConfig>
): string {
  const guideTitle = options.guideTitle.trim() || 'Curated Gift Guide';
  const recipient = options.recipient.trim() || 'The intended recipient';
  const count = options.numberOfQuestions || 4;
  const questionsToAnswer = options.questionsToAnswer?.trim() || '';
  const toneDesc = formatToneDescription(options.tone);

  const keywordSection = options.primaryKeyword?.trim()
    ? `• Primary Focus Keyword: "${options.primaryKeyword.trim()}" (Include naturally in 1–2 questions if organic; never force awkward query phrasing)`
    : '';

  const customQuestionsSection = questionsToAnswer
    ? `• Specific Questions / Topics to Address:
${questionsToAnswer.split('\n').map(q => `  - ${q}`).join('\n')}\n`
    : '• Question Sourcing: Formulate the most common, authentic questions real shoppers ask when choosing gifts for this recipient.\n';

  const additionalSection = options.additionalInstructions?.trim()
    ? `\nADDITIONAL CURATOR INSTRUCTIONS:\n${options.additionalInstructions.trim()}\n`
    : '';

  const styleSection = composeWritingStyleBlocks(
    { includeGlobal: true, includeEditorial: true },
    styles
  );

  return `Gift Guide FAQ Section Prompt — Science of Gifts

ROLE & TASK:
Act as an e-commerce editor and customer care curator for "Science of Gifts" writing the FREQUENTLY ASKED QUESTIONS (FAQ) section for a specific gift guide.

SCOPE CONSTRAINT:
Generate ONLY the FAQ section (${count} Q&As). Do NOT write the entire gift guide, introduction, or product catalog.

PARENT GIFT GUIDE CONTEXT:
• Overall Guide Title / Topic: "${guideTitle}"
• Target Recipient / Audience: ${recipient}
${keywordSection}

FAQ PARAMETERS:
• Number of Questions to Answer: Exactly ${count} questions
${customQuestionsSection}• Voice & Tone: ${toneDesc}

FAQ QUALITY DIRECTIVES:
1. Genuinely Useful & Topic-Specific Questions:
   - Every question must address a real decision friction, etiquette dilemma, or logistical concern relevant to "${guideTitle}" and ${recipient}.
   - Absolutely FORBIDDEN: fake, robotic questions invented solely to stuff keywords (e.g. "What are the best gifts for stargazers in 2026?").
   - Instead, ask real questions (e.g. "What if they already own a basic telescope?", "How do I choose between decorative star charts and functional charts?", "What's an appropriate budget for a colleague vs. close friend?").

2. Direct, Clear, and Actionable Answers:
   - Answer each question in 2–4 concise, authoritative sentences.
   - Provide concrete criteria rather than vague generalizations ("It depends").
   - Reference thoughtful gifting practices, material care, or presentation advice where relevant.
${additionalSection}
${styleSection}
OUTPUT FORMAT:
Provide:
1. Section H2 Heading (e.g. "Frequently Asked Questions About Gifting for [Recipient]")
2. Clean Q&A Pairs formatted in Markdown with bold question titles and concise paragraph answers.`;
}
