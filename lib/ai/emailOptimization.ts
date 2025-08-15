/**
 * Email personalization and nurture sequence optimization system
 * Focuses on buyer journey stages, psychological triggers, and conversion-driven messaging
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';

export interface EmailOptimizedContent {
  subject: string;
  preheader: string;
  body: string;
  callToAction: string;
  followUpSequence: EmailSequence[];
  personalizationScore: number;
  conversionPotential: number;
  nurturingElements: string[];
}

export interface EmailContext {
  buyerStage: 'awareness' | 'consideration' | 'decision';
  buyerPersona: string;
  personalizedElements: PersonalizationElement[];
  urgencyLevel: 'low' | 'medium' | 'high';
  relationshipBuilding: RelationshipElement[];
  competitiveAdvantages: string[];
  trustBuilders: string[];
}

export interface PersonalizationElement {
  type: 'demographic' | 'psychographic' | 'behavioral' | 'situational';
  trigger: string;
  message: string;
  emotion: string;
}

export interface RelationshipElement {
  type: 'expertise' | 'local_knowledge' | 'testimonial' | 'availability';
  content: string;
  credibilityScore: number;
}

export interface EmailSequence {
  sequenceType: 'immediate_followup' | 'nurture_drip' | 're_engagement' | 'closing_sequence';
  timing: string; // e.g., "2 hours", "1 day", "3 days"
  subject: string;
  purpose: string;
  content: string;
  triggers: string[];
}

/**
 * Generate email context from property data and photo insights
 */
export function buildEmailContext(
  facts: Facts,
  photoInsights?: PhotoInsights
): EmailContext {
  // Determine buyer stage based on property characteristics and market signals
  const buyerStage = determineBuyerStage(facts, photoInsights);
  
  // Create buyer persona from photo analysis and property data
  const buyerPersona = photoInsights?.buyerProfile || createBuyerPersona(facts);
  
  // Generate personalized elements based on property and buyer psychology
  const personalizedElements = generatePersonalizationElements(facts, photoInsights, buyerPersona);
  
  // Assess urgency level based on market conditions and property features
  const urgencyLevel = assessUrgencyLevel(photoInsights);
  
  // Build relationship and trust elements
  const relationshipBuilding = buildRelationshipElements(facts, photoInsights);
  
  // Extract competitive advantages
  const competitiveAdvantages = photoInsights?.socialProofElements || [
    'Professional market expertise',
    'Comprehensive property knowledge',
    'Dedicated client service'
  ];
  
  // Build trust and credibility indicators
  const trustBuilders = buildTrustElements(facts, photoInsights);
  
  return {
    buyerStage,
    buyerPersona,
    personalizedElements,
    urgencyLevel,
    relationshipBuilding,
    competitiveAdvantages,
    trustBuilders
  };
}

/**
 * Generate personalized email content optimized for conversion
 */
export function generateEmailContent(
  facts: Facts,
  photoInsights: PhotoInsights,
  emailContext: EmailContext
): EmailOptimizedContent {
  // Create compelling, personalized subject line
  const subject = generatePersonalizedSubject(facts, photoInsights, emailContext);
  
  // Generate preheader for additional engagement
  const preheader = generatePreheader(photoInsights, emailContext);
  
  // Build conversion-focused email body
  const body = buildEmailBody(facts, photoInsights, emailContext);
  
  // Create clear, compelling call-to-action
  const callToAction = generateEmailCTA(emailContext);
  
  // Generate follow-up nurture sequence
  const followUpSequence = generateNurtureSequence(facts, photoInsights, emailContext);
  
  // Calculate personalization and conversion scores
  const { personalizationScore, conversionPotential } = calculateEmailScores(
    subject, body, emailContext
  );
  
  // Extract nurturing elements for relationship building
  const nurturingElements = extractNurturingElements(emailContext);
  
  return {
    subject,
    preheader,
    body,
    callToAction,
    followUpSequence,
    personalizationScore,
    conversionPotential,
    nurturingElements
  };
}

/**
 * Determine buyer stage based on property and market signals
 */
function determineBuyerStage(facts: Facts, photoInsights?: PhotoInsights): 'awareness' | 'consideration' | 'decision' {
  // High-end properties often attract decision-stage buyers
  if (photoInsights?.propertyCategory === 'luxury') {
    return 'decision';
  }
  
  // Investment properties attract consideration-stage buyers
  if (photoInsights?.propertyCategory === 'investment') {
    return 'consideration';
  }
  
  // Family homes often attract awareness-stage buyers
  if (photoInsights?.propertyCategory === 'family') {
    return 'awareness';
  }
  
  // Default to consideration stage
  return 'consideration';
}

/**
 * Create buyer persona from property characteristics
 */
function createBuyerPersona(facts: Facts): string {
  const bedrooms = parseInt(facts.beds || '0');
  const propertyType = facts.propertyType || 'home';
  
  if (bedrooms >= 4) {
    return 'Growing families seeking space and stability';
  } else if (bedrooms <= 2 && propertyType.includes('condo')) {
    return 'Young professionals or downsizing buyers seeking convenience';
  } else if (propertyType.includes('single')) {
    return 'First-time buyers or families looking for their forever home';
  }
  
  return 'Discerning buyers seeking their ideal living space';
}

/**
 * Generate personalization elements based on buyer psychology
 */
function generatePersonalizationElements(
  facts: Facts,
  photoInsights?: PhotoInsights,
  buyerPersona?: string
): PersonalizationElement[] {
  const elements: PersonalizationElement[] = [];
  
  // Demographic personalization
  if (facts.beds && parseInt(facts.beds) >= 3) {
    elements.push({
      type: 'demographic',
      trigger: 'family_size',
      message: 'Perfect for your growing family',
      emotion: 'security and belonging'
    });
  }
  
  // Psychographic personalization based on lifestyle scenarios
  if (photoInsights?.lifestyleScenarios) {
    photoInsights.lifestyleScenarios.forEach(scenario => {
      elements.push({
        type: 'psychographic',
        trigger: 'lifestyle_aspiration',
        message: scenario,
        emotion: 'aspiration and excitement'
      });
    });
  }
  
  // Behavioral personalization based on property features
  if (photoInsights?.features?.includes('pool')) {
    elements.push({
      type: 'behavioral',
      trigger: 'entertainment_lifestyle',
      message: 'Ideal for entertaining and creating lasting memories',
      emotion: 'joy and social connection'
    });
  }
  
  // Situational personalization based on urgency triggers
  if (photoInsights?.urgencyTriggers) {
    photoInsights.urgencyTriggers.forEach(trigger => {
      elements.push({
        type: 'situational',
        trigger: 'market_timing',
        message: trigger,
        emotion: 'urgency and opportunity'
      });
    });
  }
  
  return elements;
}

/**
 * Assess urgency level for email messaging
 */
function assessUrgencyLevel(photoInsights?: PhotoInsights): 'low' | 'medium' | 'high' {
  const urgencyCount = photoInsights?.urgencyTriggers?.length || 0;
  const socialProofCount = photoInsights?.socialProofElements?.length || 0;
  
  if (urgencyCount >= 3 || socialProofCount >= 4) {
    return 'high';
  } else if (urgencyCount >= 1 || socialProofCount >= 2) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Build relationship and trust elements
 */
function buildRelationshipElements(facts: Facts, photoInsights?: PhotoInsights): RelationshipElement[] {
  const elements: RelationshipElement[] = [];
  
  // Local expertise
  if (facts.neighborhood) {
    elements.push({
      type: 'local_knowledge',
      content: `As your local ${facts.neighborhood} specialist, I have deep insights into this market`,
      credibilityScore: 8
    });
  }
  
  // Property expertise
  elements.push({
    type: 'expertise',
    content: 'With years of experience helping buyers find their perfect home',
    credibilityScore: 7
  });
  
  // Availability and service
  elements.push({
    type: 'availability',
    content: 'I\'m here to guide you through every step of the home buying process',
    credibilityScore: 6
  });
  
  return elements;
}

/**
 * Build trust and credibility indicators
 */
function buildTrustElements(facts: Facts, photoInsights?: PhotoInsights): string[] {
  const trustElements = [
    'Professional market analysis included',
    'Comprehensive property evaluation',
    'Transparent communication throughout'
  ];
  
  // Add photo-specific trust elements
  if (photoInsights?.socialProofElements) {
    trustElements.push(...photoInsights.socialProofElements);
  }
  
  return trustElements.slice(0, 5);
}

/**
 * Generate personalized, conversion-focused subject line
 */
function generatePersonalizedSubject(
  facts: Facts,
  photoInsights: PhotoInsights,
  context: EmailContext
): string {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  const neighborhood = facts.neighborhood;
  
  // Stage-specific subject lines
  switch (context.buyerStage) {
    case 'awareness':
      return neighborhood 
        ? `Your ${neighborhood} home search: ${headlineFeature} inside`
        : `Perfect home with ${headlineFeature} - see inside`;
    
    case 'consideration':
      return `Found it: ${headlineFeature} in ${neighborhood || 'prime location'}`;
    
    case 'decision':
      return `Act now: Exceptional ${facts.propertyType || 'home'} with ${headlineFeature}`;
    
    default:
      return `${headlineFeature} - your dream home awaits`;
  }
}

/**
 * Generate compelling preheader text
 */
function generatePreheader(photoInsights: PhotoInsights, context: EmailContext): string {
  const lifestyle = photoInsights.lifestyleScenarios?.[0];
  const urgency = context.urgencyLevel === 'high' ? 'This opportunity won\'t last long.' : '';
  
  if (lifestyle && urgency) {
    return `${lifestyle} ${urgency}`;
  } else if (lifestyle) {
    return lifestyle;
  } else if (urgency) {
    return urgency;
  }
  
  return 'See why this property is perfect for you...';
}

/**
 * Build conversion-focused email body
 */
function buildEmailBody(
  facts: Facts,
  photoInsights: PhotoInsights,
  context: EmailContext
): string {
  const sections: string[] = [];
  
  // Personalized opening based on buyer persona
  sections.push(generatePersonalizedOpening(context.buyerPersona, photoInsights));
  
  // Property highlights with emotional benefits
  sections.push(generatePropertyHighlights(facts, photoInsights));
  
  // Lifestyle benefits section
  if (photoInsights.lifestyleScenarios && photoInsights.lifestyleScenarios.length > 0) {
    sections.push(generateLifestyleBenefits(photoInsights.lifestyleScenarios));
  }
  
  // Trust and credibility section
  sections.push(generateTrustSection(context.relationshipBuilding));
  
  // Urgency and next steps
  sections.push(generateUrgencySection(context.urgencyLevel, photoInsights.urgencyTriggers));
  
  return sections.join('\n\n');
}

/**
 * Generate personalized email opening
 */
function generatePersonalizedOpening(buyerPersona: string, photoInsights: PhotoInsights): string {
  const conversionHook = photoInsights.conversionHooks?.[0];
  
  if (conversionHook) {
    return `${conversionHook}\n\nI found this property specifically with ${buyerPersona.toLowerCase()} in mind.`;
  }
  
  return `I understand you're looking for something special, and I believe this property could be exactly what you've been searching for.`;
}

/**
 * Generate property highlights with emotional benefits
 */
function generatePropertyHighlights(facts: Facts, photoInsights: PhotoInsights): string {
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const benefits = photoInsights.buyerBenefits || [];
  
  const highlights: string[] = [];
  
  // Basic property details
  const bedBath = `${facts.beds || ''} bedroom, ${facts.baths || ''} bathroom ${facts.propertyType || 'home'}`;
  highlights.push(`This beautiful ${bedBath} offers:`);
  
  // Feature-benefit combinations
  mustMentionFeatures.slice(0, 4).forEach(feature => {
    const benefit = benefits.find(b => b.feature === feature);
    if (benefit) {
      highlights.push(`• ${feature} - ${benefit.benefit}`);
    } else {
      highlights.push(`• ${feature}`);
    }
  });
  
  return highlights.join('\n');
}

/**
 * Generate lifestyle benefits section
 */
function generateLifestyleBenefits(lifestyleScenarios: string[]): string {
  return `What this means for your lifestyle:\n\n${lifestyleScenarios.slice(0, 2).map(scenario => `• ${scenario}`).join('\n')}`;
}

/**
 * Generate trust and relationship section
 */
function generateTrustSection(relationshipElements: RelationshipElement[]): string {
  const expertise = relationshipElements.find(r => r.type === 'local_knowledge')?.content ||
                   relationshipElements.find(r => r.type === 'expertise')?.content ||
                   'With my experience in this market, I can guide you through every step.';
  
  return `${expertise}\n\nI'm committed to making your home buying journey as smooth and successful as possible.`;
}

/**
 * Generate urgency and next steps section
 */
function generateUrgencySection(urgencyLevel: 'low' | 'medium' | 'high', urgencyTriggers?: string[]): string {
  let urgencyMessage = '';
  
  switch (urgencyLevel) {
    case 'high':
      urgencyMessage = urgencyTriggers?.[0] || 'Properties like this are in high demand and move quickly.';
      break;
    case 'medium':
      urgencyMessage = 'I recommend scheduling a viewing soon to avoid disappointment.';
      break;
    case 'low':
      urgencyMessage = 'I\'d love to show you this property when it\'s convenient for you.';
      break;
  }
  
  return `${urgencyMessage}\n\nReady to see your potential new home?`;
}

/**
 * Generate clear, compelling call-to-action
 */
function generateEmailCTA(context: EmailContext): string {
  switch (context.urgencyLevel) {
    case 'high':
      return 'Schedule your priority viewing today - call me now!';
    case 'medium':
      return 'Let\'s schedule your private showing this week.';
    case 'low':
      return 'Reply to arrange a convenient viewing time.';
    default:
      return 'Contact me to learn more and schedule your showing.';
  }
}

/**
 * Generate nurture sequence for ongoing relationship building
 */
function generateNurtureSequence(
  facts: Facts,
  photoInsights: PhotoInsights,
  context: EmailContext
): EmailSequence[] {
  const sequences: EmailSequence[] = [];
  
  // Immediate follow-up (2 hours)
  sequences.push({
    sequenceType: 'immediate_followup',
    timing: '2 hours',
    subject: 'Quick question about the property I sent',
    purpose: 'Check engagement and offer additional information',
    content: 'I wanted to follow up on the property I shared with you. Do you have any initial questions? I\'d be happy to provide more details or schedule a viewing at your convenience.',
    triggers: ['no_response', 'email_opened_but_not_clicked']
  });
  
  // Value-add follow-up (1 day)
  sequences.push({
    sequenceType: 'nurture_drip',
    timing: '1 day',
    subject: `Market insights for ${facts.neighborhood || 'your area'}`,
    purpose: 'Provide value and demonstrate expertise',
    content: `I thought you might find these recent market trends interesting for ${facts.neighborhood || 'the area'}. Understanding the local market can help you make the best decision for your family's future.`,
    triggers: ['minimal_engagement', 'market_research_interest']
  });
  
  // Social proof and testimonials (3 days)
  sequences.push({
    sequenceType: 'nurture_drip',
    timing: '3 days',
    subject: 'What my clients say about finding their dream home',
    purpose: 'Build trust through social proof',
    content: 'I love helping families find their perfect home. Here\'s what some of my recent clients have shared about their experience working with me...',
    triggers: ['trust_building_needed', 'decision_hesitation']
  });
  
  // Re-engagement (1 week)
  sequences.push({
    sequenceType: 're_engagement',
    timing: '1 week',
    subject: 'Still searching? I have new options for you',
    purpose: 'Re-engage with new opportunities',
    content: 'If this property wasn\'t quite right, I understand. I have several new listings that might be an even better fit for what you\'re looking for.',
    triggers: ['no_response_week', 'continued_searching']
  });
  
  return sequences;
}

/**
 * Calculate email personalization and conversion scores
 */
function calculateEmailScores(
  subject: string,
  body: string,
  context: EmailContext
): { personalizationScore: number; conversionPotential: number } {
  let personalizationScore = 0;
  let conversionPotential = 0;
  
  // Personalization scoring (out of 100)
  const personalizedElementsCount = context.personalizedElements.length;
  personalizationScore += Math.min(personalizedElementsCount * 15, 60); // Max 60 points
  
  if (context.buyerPersona !== 'general') personalizationScore += 15;
  if (subject.length >= 30 && subject.length <= 50) personalizationScore += 10;
  if (body.includes('you')) personalizationScore += 10;
  if (body.includes(context.buyerPersona.toLowerCase())) personalizationScore += 5;
  
  // Conversion potential scoring (out of 100)
  const urgencyMultiplier = context.urgencyLevel === 'high' ? 1.3 : context.urgencyLevel === 'medium' ? 1.1 : 1.0;
  
  // Content quality factors
  const emotionalWords = ['imagine', 'perfect', 'dream', 'love', 'ideal', 'beautiful'];
  const emotionalCount = emotionalWords.filter(word => body.toLowerCase().includes(word)).length;
  conversionPotential += Math.min(emotionalCount * 8, 40);
  
  // Trust building elements
  conversionPotential += Math.min(context.trustBuilders.length * 5, 25);
  
  // Clear CTA presence
  if (body.toLowerCase().includes('schedule') || body.toLowerCase().includes('call')) {
    conversionPotential += 20;
  }
  
  // Relationship building
  conversionPotential += Math.min(context.relationshipBuilding.length * 5, 15);
  
  // Apply urgency multiplier
  conversionPotential = Math.min(conversionPotential * urgencyMultiplier, 100);
  
  return {
    personalizationScore: Math.min(personalizationScore, 100),
    conversionPotential: Math.min(conversionPotential, 100)
  };
}

/**
 * Extract nurturing elements for relationship building
 */
function extractNurturingElements(context: EmailContext): string[] {
  const elements: string[] = [];
  
  // Add relationship building elements
  context.relationshipBuilding.forEach(rel => {
    elements.push(rel.content);
  });
  
  // Add trust builders
  elements.push(...context.trustBuilders.slice(0, 3));
  
  // Add competitive advantages
  elements.push(...context.competitiveAdvantages.slice(0, 2));
  
  return elements;
}

/**
 * Validate email content meets conversion best practices
 */
export function validateEmailContent(content: EmailOptimizedContent): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Subject line validation
  if (!content.subject || content.subject.length < 20) {
    issues.push('Subject line too short for engagement');
    score -= 15;
  }
  
  if (content.subject.length > 60) {
    issues.push('Subject line too long - may be truncated in inbox');
    score -= 10;
  }
  
  // Body content validation
  if (content.body.length < 200) {
    issues.push('Email body too short for effective nurturing');
    score -= 20;
  }
  
  if (content.body.length > 1000) {
    issues.push('Email body too long - may reduce engagement');
    score -= 15;
  }
  
  // Personalization validation
  if (content.personalizationScore < 50) {
    issues.push('Insufficient personalization for targeted messaging');
    score -= 20;
  }
  
  // Conversion potential validation
  if (content.conversionPotential < 60) {
    issues.push('Low conversion potential - missing key persuasion elements');
    score -= 25;
  }
  
  // CTA validation
  if (!content.callToAction || content.callToAction.length < 10) {
    issues.push('Weak or missing call-to-action');
    score -= 15;
  }
  
  // Nurture sequence validation
  if (content.followUpSequence.length < 2) {
    issues.push('Insufficient follow-up sequence for nurturing');
    score -= 10;
  }
  
  return {
    isValid: issues.length <= 1 && score >= 70,
    issues,
    score: Math.max(0, score)
  };
}