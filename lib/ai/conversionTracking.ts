/**
 * Conversion tracking and funnel optimization system
 * Tracks user journey from content engagement to lead conversion
 */

import type { PhotoInsights } from './photoAnalysis';

export interface ConversionFunnel {
  stages: FunnelStage[];
  overallConversionRate: number;
  bottlenecks: Bottleneck[];
  optimizations: FunnelOptimization[];
  attribution: AttributionModel;
  performance: FunnelPerformance;
}

export interface FunnelStage {
  stage: 'awareness' | 'interest' | 'consideration' | 'intent' | 'evaluation' | 'purchase';
  name: string;
  description: string;
  entryPoints: string[];
  exitPoints: string[];
  conversionRate: number;
  averageTimeInStage: string;
  keyActions: string[];
  successMetrics: SuccessMetric[];
  barriers: StageBarrier[];
  optimizationOpportunities: OptimizationOpportunity[];
}

export interface SuccessMetric {
  metric: string;
  target: number;
  current: number;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface StageBarrier {
  barrier: string;
  impact: 'high' | 'medium' | 'low';
  frequency: number;
  solution: string;
  effort: 'low' | 'medium' | 'high';
}

export interface OptimizationOpportunity {
  opportunity: string;
  expectedImpact: string;
  implementation: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface Bottleneck {
  stage: string;
  severity: 'critical' | 'major' | 'minor';
  conversionLoss: number;
  rootCause: string;
  solution: BottleneckSolution;
  priority: number;
}

export interface BottleneckSolution {
  approach: string;
  steps: string[];
  expectedImprovement: number;
  timeline: string;
  resources: string[];
}

export interface FunnelOptimization {
  type: 'content' | 'process' | 'timing' | 'personalization' | 'followup';
  optimization: string;
  targetStage: string;
  expectedLift: number;
  implementation: Implementation;
  measurement: Measurement;
}

export interface Implementation {
  description: string;
  steps: string[];
  requirements: string[];
  timeline: string;
}

export interface Measurement {
  kpis: string[];
  testDuration: string;
  successCriteria: string;
  rollbackPlan: string;
}

export interface AttributionModel {
  model: 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based';
  channelAttribution: ChannelAttribution[];
  contentAttribution: ContentAttribution[];
  touchpointJourney: TouchpointJourney;
}

export interface ChannelAttribution {
  channel: string;
  contribution: number;
  conversions: number;
  revenue: number;
  costPerConversion: number;
  roi: number;
}

export interface ContentAttribution {
  contentType: string;
  stage: string;
  influence: number;
  conversions: number;
  assists: number;
  lastTouchConversions: number;
}

export interface TouchpointJourney {
  averageTouchpoints: number;
  conversionPath: string[];
  topPaths: ConversionPath[];
  pathEfficiency: number;
}

export interface ConversionPath {
  path: string[];
  frequency: number;
  conversionRate: number;
  averageValue: number;
  efficiency: number;
}

export interface FunnelPerformance {
  timeframe: string;
  totalConversions: number;
  conversionRate: number;
  averageValue: number;
  totalRevenue: number;
  costPerAcquisition: number;
  returnOnInvestment: number;
  trends: PerformanceTrend[];
}

export interface PerformanceTrend {
  metric: string;
  direction: 'up' | 'down' | 'flat';
  magnitude: number;
  significance: 'significant' | 'moderate' | 'minimal';
  causes: string[];
}

export interface ConversionEvent {
  eventId: string;
  timestamp: Date;
  stage: string;
  action: string;
  channel: string;
  contentId?: string;
  propertyId?: string;
  userId?: string;
  sessionId: string;
  value?: number;
  metadata: Record<string, any>;
}

export interface ConversionTrackingConfig {
  stages: string[];
  events: string[];
  attribution: {
    model: string;
    lookbackWindow: number;
  };
  goals: ConversionGoal[];
}

export interface ConversionGoal {
  name: string;
  stage: string;
  events: string[];
  value: number;
  priority: 'primary' | 'secondary' | 'micro';
}

/**
 * Create and analyze conversion funnel
 */
export function createConversionFunnel(
  propertyData: any,
  photoInsights: PhotoInsights,
  historicalData?: ConversionEvent[]
): ConversionFunnel {
  const stages = defineRealEstateFunnelStages();
  const bottlenecks = identifyBottlenecks(stages, historicalData);
  const optimizations = generateOptimizations(stages, bottlenecks, photoInsights);
  const attribution = buildAttributionModel(historicalData);
  const performance = calculateFunnelPerformance(stages, historicalData);
  
  const overallConversionRate = calculateOverallConversionRate(stages);
  
  return {
    stages,
    overallConversionRate,
    bottlenecks,
    optimizations,
    attribution,
    performance
  };
}

/**
 * Define real estate specific funnel stages
 */
function defineRealEstateFunnelStages(): FunnelStage[] {
  return [
    {
      stage: 'awareness',
      name: 'Property Discovery',
      description: 'Potential buyer becomes aware of the property',
      entryPoints: ['Social media', 'MLS listing', 'Website', 'Referral'],
      exitPoints: ['Lost interest', 'Not in budget', 'Wrong location'],
      conversionRate: 25,
      averageTimeInStage: '1-3 days',
      keyActions: ['View listing', 'Browse photos', 'Read description'],
      successMetrics: [
        {
          metric: 'View rate',
          target: 30,
          current: 25,
          unit: '%',
          trend: 'stable'
        },
        {
          metric: 'Time on listing',
          target: 180,
          current: 145,
          unit: 'seconds',
          trend: 'increasing'
        }
      ],
      barriers: [
        {
          barrier: 'Poor photo quality',
          impact: 'high',
          frequency: 30,
          solution: 'Professional photography',
          effort: 'medium'
        },
        {
          barrier: 'Unclear headline',
          impact: 'medium',
          frequency: 20,
          solution: 'Optimize listing title',
          effort: 'low'
        }
      ],
      optimizationOpportunities: [
        {
          opportunity: 'Add virtual tour',
          expectedImpact: '15-20% increase in engagement',
          implementation: ['Create 360° tour', 'Add to all listings', 'Promote virtual tour access'],
          priority: 'high',
          effort: 'medium',
          timeframe: '2 weeks'
        }
      ]
    },
    {
      stage: 'interest',
      name: 'Initial Interest',
      description: 'Buyer shows interest by taking action',
      entryPoints: ['Continued browsing', 'Save listing', 'Share with partner'],
      exitPoints: ['Found better option', 'Timing not right', 'Budget mismatch'],
      conversionRate: 45,
      averageTimeInStage: '3-7 days',
      keyActions: ['Save listing', 'Share listing', 'Contact agent'],
      successMetrics: [
        {
          metric: 'Save rate',
          target: 50,
          current: 45,
          unit: '%',
          trend: 'increasing'
        },
        {
          metric: 'Share rate',
          target: 20,
          current: 15,
          unit: '%',
          trend: 'stable'
        }
      ],
      barriers: [
        {
          barrier: 'Limited property information',
          impact: 'high',
          frequency: 25,
          solution: 'Comprehensive property details',
          effort: 'low'
        }
      ],
      optimizationOpportunities: [
        {
          opportunity: 'Automated follow-up sequence',
          expectedImpact: '20-25% improvement in progression',
          implementation: ['Set up email automation', 'Personalize messaging', 'Include market insights'],
          priority: 'high',
          effort: 'low',
          timeframe: '1 week'
        }
      ]
    },
    {
      stage: 'consideration',
      name: 'Active Consideration',
      description: 'Buyer actively considers the property',
      entryPoints: ['Agent contact', 'Request information', 'Schedule showing'],
      exitPoints: ['Property concerns', 'Competitive option', 'Financing issues'],
      conversionRate: 65,
      averageTimeInStage: '1-2 weeks',
      keyActions: ['Request showing', 'Ask questions', 'Research neighborhood'],
      successMetrics: [
        {
          metric: 'Showing request rate',
          target: 70,
          current: 65,
          unit: '%',
          trend: 'stable'
        },
        {
          metric: 'Information request rate',
          target: 40,
          current: 35,
          unit: '%',
          trend: 'increasing'
        }
      ],
      barriers: [
        {
          barrier: 'Slow response time',
          impact: 'high',
          frequency: 20,
          solution: 'Automated quick response system',
          effort: 'medium'
        }
      ],
      optimizationOpportunities: [
        {
          opportunity: 'Neighborhood insights package',
          expectedImpact: '10-15% increase in showing requests',
          implementation: ['Create neighborhood guide', 'Include market data', 'Add lifestyle information'],
          priority: 'medium',
          effort: 'medium',
          timeframe: '3 weeks'
        }
      ]
    },
    {
      stage: 'intent',
      name: 'Purchase Intent',
      description: 'Buyer shows clear intent to purchase',
      entryPoints: ['Schedule showing', 'Request financial info', 'Bring family to view'],
      exitPoints: ['Property flaws discovered', 'Financing denied', 'Better option found'],
      conversionRate: 75,
      averageTimeInStage: '1 week',
      keyActions: ['Attend showing', 'Second viewing', 'Discuss financing'],
      successMetrics: [
        {
          metric: 'Showing attendance rate',
          target: 80,
          current: 75,
          unit: '%',
          trend: 'stable'
        },
        {
          metric: 'Second viewing rate',
          target: 60,
          current: 55,
          unit: '%',
          trend: 'increasing'
        }
      ],
      barriers: [
        {
          barrier: 'Property condition issues',
          impact: 'high',
          frequency: 15,
          solution: 'Pre-inspection disclosure',
          effort: 'medium'
        }
      ],
      optimizationOpportunities: [
        {
          opportunity: 'Pre-qualified buyer focus',
          expectedImpact: '20-30% reduction in fall-through rate',
          implementation: ['Qualify buyers upfront', 'Provide financing guidance', 'Connect with preferred lenders'],
          priority: 'critical',
          effort: 'high',
          timeframe: '4 weeks'
        }
      ]
    },
    {
      stage: 'evaluation',
      name: 'Final Evaluation',
      description: 'Buyer evaluates and prepares offer',
      entryPoints: ['Multiple viewings', 'Financial pre-approval', 'Serious interest expressed'],
      exitPoints: ['Offer rejected', 'Financing issues', 'Cold feet'],
      conversionRate: 80,
      averageTimeInStage: '3-5 days',
      keyActions: ['Make offer', 'Negotiate terms', 'Schedule inspection'],
      successMetrics: [
        {
          metric: 'Offer submission rate',
          target: 85,
          current: 80,
          unit: '%',
          trend: 'stable'
        },
        {
          metric: 'Offer acceptance rate',
          target: 70,
          current: 65,
          unit: '%',
          trend: 'increasing'
        }
      ],
      barriers: [
        {
          barrier: 'Pricing concerns',
          impact: 'high',
          frequency: 25,
          solution: 'Comparative market analysis',
          effort: 'low'
        }
      ],
      optimizationOpportunities: [
        {
          opportunity: 'Market positioning strategy',
          expectedImpact: '10-15% improvement in offer acceptance',
          implementation: ['Provide CMA', 'Justify pricing', 'Show value proposition'],
          priority: 'high',
          effort: 'low',
          timeframe: '1 week'
        }
      ]
    },
    {
      stage: 'purchase',
      name: 'Purchase Completion',
      description: 'Buyer completes the purchase process',
      entryPoints: ['Accepted offer', 'Financing approved', 'Inspection passed'],
      exitPoints: ['Financing denial', 'Inspection issues', 'Title problems'],
      conversionRate: 90,
      averageTimeInStage: '30-45 days',
      keyActions: ['Finalize financing', 'Complete inspection', 'Close transaction'],
      successMetrics: [
        {
          metric: 'Closing rate',
          target: 95,
          current: 90,
          unit: '%',
          trend: 'stable'
        },
        {
          metric: 'Days to close',
          target: 35,
          current: 42,
          unit: 'days',
          trend: 'decreasing'
        }
      ],
      barriers: [
        {
          barrier: 'Financing delays',
          impact: 'high',
          frequency: 10,
          solution: 'Preferred lender network',
          effort: 'medium'
        }
      ],
      optimizationOpportunities: [
        {
          opportunity: 'Transaction management system',
          expectedImpact: '5-10% faster closings',
          implementation: ['Implement tracking system', 'Automate milestones', 'Proactive communication'],
          priority: 'medium',
          effort: 'high',
          timeframe: '6 weeks'
        }
      ]
    }
  ];
}

/**
 * Identify funnel bottlenecks
 */
function identifyBottlenecks(stages: FunnelStage[], historicalData?: ConversionEvent[]): Bottleneck[] {
  const bottlenecks: Bottleneck[] = [];
  
  // Find stages with low conversion rates
  stages.forEach((stage, index) => {
    if (stage.conversionRate < 50) {
      bottlenecks.push({
        stage: stage.name,
        severity: 'major',
        conversionLoss: 50 - stage.conversionRate,
        rootCause: stage.barriers[0]?.barrier || 'Unknown barrier',
        solution: {
          approach: stage.optimizationOpportunities[0]?.opportunity || 'Requires analysis',
          steps: stage.optimizationOpportunities[0]?.implementation || ['Investigate root cause'],
          expectedImprovement: 15,
          timeline: '2-4 weeks',
          resources: ['Marketing team', 'Sales team']
        },
        priority: index + 1
      });
    }
  });
  
  // Add critical bottlenecks based on business impact
  if (bottlenecks.length === 0) {
    bottlenecks.push({
      stage: 'Property Discovery',
      severity: 'minor',
      conversionLoss: 5,
      rootCause: 'Room for optimization in initial engagement',
      solution: {
        approach: 'Enhance visual presentation and listing optimization',
        steps: ['Improve photo quality', 'Optimize headlines', 'Add virtual tours'],
        expectedImprovement: 8,
        timeline: '1-2 weeks',
        resources: ['Photography team', 'Marketing team']
      },
      priority: 1
    });
  }
  
  return bottlenecks;
}

/**
 * Generate funnel optimizations
 */
function generateOptimizations(
  stages: FunnelStage[], 
  bottlenecks: Bottleneck[], 
  photoInsights: PhotoInsights
): FunnelOptimization[] {
  const optimizations: FunnelOptimization[] = [];
  
  // Content optimizations based on photo insights
  if (photoInsights.mustMentionFeatures && photoInsights.mustMentionFeatures.length > 0) {
    optimizations.push({
      type: 'content',
      optimization: 'Feature-focused content strategy',
      targetStage: 'awareness',
      expectedLift: 18,
      implementation: {
        description: 'Highlight key property features in all marketing content',
        steps: [
          'Identify top 3 must-mention features',
          'Create feature-focused headlines',
          'Integrate features into all content types',
          'A/B test feature presentation'
        ],
        requirements: ['Content team', 'Photo analysis data', 'A/B testing tools'],
        timeline: '2 weeks'
      },
      measurement: {
        kpis: ['View rate', 'Engagement rate', 'Time on page'],
        testDuration: '4 weeks',
        successCriteria: '15% improvement in view-to-interest conversion',
        rollbackPlan: 'Revert to previous content if no improvement after 4 weeks'
      }
    });
  }
  
  // Process optimizations
  optimizations.push({
    type: 'process',
    optimization: 'Automated lead nurturing sequence',
    targetStage: 'interest',
    expectedLift: 25,
    implementation: {
      description: 'Implement automated follow-up sequence for interested prospects',
      steps: [
        'Design email sequence templates',
        'Set up automation triggers',
        'Personalize content based on property interest',
        'Include market insights and property updates'
      ],
      requirements: ['Marketing automation platform', 'Email templates', 'Market data'],
      timeline: '1 week'
    },
    measurement: {
      kpis: ['Email open rate', 'Click-through rate', 'Conversion to showing'],
      testDuration: '6 weeks',
      successCriteria: '20% improvement in interest-to-consideration conversion',
      rollbackPlan: 'Manual follow-up process'
    }
  });
  
  // Timing optimizations
  optimizations.push({
    type: 'timing',
    optimization: 'Optimal content publishing schedule',
    targetStage: 'awareness',
    expectedLift: 12,
    implementation: {
      description: 'Publish content when target audience is most active',
      steps: [
        'Analyze audience activity patterns',
        'Identify optimal posting times',
        'Schedule content for peak engagement',
        'Monitor and adjust based on performance'
      ],
      requirements: ['Analytics tools', 'Content scheduling platform'],
      timeline: '1 week'
    },
    measurement: {
      kpis: ['Initial engagement rate', 'Reach', 'Click-through rate'],
      testDuration: '3 weeks',
      successCriteria: '10% improvement in initial engagement',
      rollbackPlan: 'Return to current posting schedule'
    }
  });
  
  // Personalization optimizations
  if (photoInsights.buyerProfile) {
    optimizations.push({
      type: 'personalization',
      optimization: 'Buyer persona-specific messaging',
      targetStage: 'consideration',
      expectedLift: 22,
      implementation: {
        description: 'Tailor messaging based on identified buyer persona',
        steps: [
          'Create persona-specific content variants',
          'Implement dynamic content selection',
          'Personalize follow-up communications',
          'Adjust value propositions by persona'
        ],
        requirements: ['Persona identification system', 'Dynamic content platform'],
        timeline: '3 weeks'
      },
      measurement: {
        kpis: ['Personalization effectiveness', 'Conversion rate by persona', 'Engagement depth'],
        testDuration: '8 weeks',
        successCriteria: '20% improvement in persona-aligned conversions',
        rollbackPlan: 'Generic messaging approach'
      }
    });
  }
  
  return optimizations;
}

/**
 * Build attribution model
 */
function buildAttributionModel(historicalData?: ConversionEvent[]): AttributionModel {
  // Default attribution model with placeholder data
  return {
    model: 'position-based',
    channelAttribution: [
      {
        channel: 'Social Media',
        contribution: 35,
        conversions: 28,
        revenue: 280000,
        costPerConversion: 125,
        roi: 2.8
      },
      {
        channel: 'MLS Listing',
        contribution: 25,
        conversions: 20,
        revenue: 200000,
        costPerConversion: 75,
        roi: 3.2
      },
      {
        channel: 'Website',
        contribution: 20,
        conversions: 16,
        revenue: 160000,
        costPerConversion: 100,
        roi: 2.5
      },
      {
        channel: 'Referral',
        contribution: 15,
        conversions: 12,
        revenue: 120000,
        costPerConversion: 50,
        roi: 4.0
      },
      {
        channel: 'Email',
        contribution: 5,
        conversions: 4,
        revenue: 40000,
        costPerConversion: 25,
        roi: 5.0
      }
    ],
    contentAttribution: [
      {
        contentType: 'Instagram Carousel',
        stage: 'awareness',
        influence: 40,
        conversions: 15,
        assists: 32,
        lastTouchConversions: 8
      },
      {
        contentType: 'MLS Description',
        stage: 'consideration',
        influence: 60,
        conversions: 25,
        assists: 18,
        lastTouchConversions: 18
      },
      {
        contentType: 'Email Nurture',
        stage: 'intent',
        influence: 30,
        conversions: 12,
        assists: 28,
        lastTouchConversions: 4
      }
    ],
    touchpointJourney: {
      averageTouchpoints: 7.2,
      conversionPath: ['Social Media', 'Website', 'Email', 'Showing', 'Purchase'],
      topPaths: [
        {
          path: ['Instagram', 'MLS', 'Email', 'Showing', 'Purchase'],
          frequency: 35,
          conversionRate: 12,
          averageValue: 450000,
          efficiency: 85
        },
        {
          path: ['MLS', 'Website', 'Phone', 'Showing', 'Purchase'],
          frequency: 28,
          conversionRate: 15,
          averageValue: 380000,
          efficiency: 92
        }
      ],
      pathEfficiency: 82
    }
  };
}

/**
 * Calculate funnel performance metrics
 */
function calculateFunnelPerformance(stages: FunnelStage[], historicalData?: ConversionEvent[]): FunnelPerformance {
  const totalConversions = 80; // Based on sample data
  const totalRevenue = 800000;
  const totalCost = 120000;
  
  return {
    timeframe: 'Last 90 days',
    totalConversions,
    conversionRate: calculateOverallConversionRate(stages),
    averageValue: totalRevenue / totalConversions,
    totalRevenue,
    costPerAcquisition: totalCost / totalConversions,
    returnOnInvestment: ((totalRevenue - totalCost) / totalCost) * 100,
    trends: [
      {
        metric: 'Conversion Rate',
        direction: 'up',
        magnitude: 15,
        significance: 'moderate',
        causes: ['Improved content quality', 'Better lead qualification']
      },
      {
        metric: 'Average Deal Value',
        direction: 'up',
        magnitude: 8,
        significance: 'minimal',
        causes: ['Market appreciation', 'Premium property focus']
      },
      {
        metric: 'Time to Close',
        direction: 'down',
        magnitude: 12,
        significance: 'significant',
        causes: ['Process optimization', 'Better lender relationships']
      }
    ]
  };
}

/**
 * Calculate overall conversion rate across all stages
 */
function calculateOverallConversionRate(stages: FunnelStage[]): number {
  return stages.reduce((rate, stage) => rate * (stage.conversionRate / 100), 100);
}

/**
 * Track conversion event
 */
export function trackConversionEvent(event: Omit<ConversionEvent, 'eventId' | 'timestamp'>): ConversionEvent {
  return {
    eventId: generateEventId(),
    timestamp: new Date(),
    ...event
  };
}

/**
 * Generate unique event ID
 */
function generateEventId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Analyze funnel performance over time
 */
export function analyzeFunnelTrends(events: ConversionEvent[], timeframe: string): PerformanceTrend[] {
  // Placeholder implementation - would analyze historical events
  return [
    {
      metric: 'Overall Conversion Rate',
      direction: 'up',
      magnitude: 18,
      significance: 'significant',
      causes: ['Content optimization', 'Process improvements', 'Better targeting']
    }
  ];
}