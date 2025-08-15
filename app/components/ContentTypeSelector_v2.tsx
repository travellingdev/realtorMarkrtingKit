'use client';
import React, { useState } from 'react';
import { 
  Home,
  Target, 
  MessageSquare,
  Heart,
  TrendingUp,
  Users,
  FileText,
  Instagram,
  Mail,
  Video,
  Facebook,
  Check,
  Clock,
  Award
} from 'lucide-react';
import { type RealtorPersona } from '@/lib/personaDetector';

export interface ContentType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  outcomes: string[];
  channels: string[];
  timeToValue: string;
  bestFor: RealtorPersona[];
  examples: {
    title: string;
    preview: string;
  }[];
}

const CONTENT_TYPES: ContentType[] = [
  {
    id: 'listing_package',
    name: 'Complete Listing Package',
    description: 'Everything you need to market a new listing professionally',
    icon: <Home className="h-5 w-5" />,
    outcomes: [
      'MLS-safe professional description',
      'Buyer-attracting social media posts', 
      'Open house promotion emails',
      'Consistent brand messaging'
    ],
    channels: ['mls', 'instagram', 'email', 'facebook'],
    timeToValue: '2 minutes',
    bestFor: ['new_agent', 'experienced', 'luxury'],
    examples: [
      {
        title: 'MLS Description',
        preview: 'Sun-filled 3BR home with chef\'s kitchen and hardwood floors...'
      },
      {
        title: 'Instagram Post', 
        preview: 'Just Listed! 🏡 This Brookfield gem won\'t last long...'
      },
      {
        title: 'Open House Email',
        preview: 'You\'re invited to explore this stunning 3-bedroom home...'
      }
    ]
  },
  {
    id: 'buyer_attraction',
    name: 'Buyer Magnet Content',
    description: 'Hooks and teasers that get buyers excited about viewing',
    icon: <Target className="h-5 w-5" />,
    outcomes: [
      'Curiosity-building social media hooks',
      'Urgency-creating email subject lines',
      'Behind-the-scenes story content',
      'FOMO-inducing listing teasers'
    ],
    channels: ['instagram', 'email', 'facebook', 'stories'],
    timeToValue: '1 minute',
    bestFor: ['experienced', 'luxury', 'volume'],
    examples: [
      {
        title: 'Social Hook',
        preview: 'If natural light matters to you, you need to see this...'
      },
      {
        title: 'Email Teaser',
        preview: 'The kitchen alone will make you fall in love with this place'
      },
      {
        title: 'Story Content',
        preview: 'Behind the scenes: Why this listing is special 📸'
      }
    ]
  },
  {
    id: 'seller_communication',
    name: 'Seller Updates & Retention',
    description: 'Keep sellers informed, happy, and confident in your service',
    icon: <MessageSquare className="h-5 w-5" />,
    outcomes: [
      'Professional progress reports',
      'Market condition explanations',
      'Showing feedback summaries', 
      'Pricing strategy communications'
    ],
    channels: ['email', 'text', 'reports'],
    timeToValue: '30 seconds',
    bestFor: ['experienced', 'luxury', 'team_leader'],
    examples: [
      {
        title: 'Weekly Update',
        preview: 'Great news! Your listing had 12 showings this week...'
      },
      {
        title: 'Market Report',
        preview: 'Current market conditions in your neighborhood show...'
      },
      {
        title: 'Feedback Summary',
        preview: 'Here\'s what potential buyers are saying about your home...'
      }
    ]
  },
  {
    id: 'client_nurturing',
    name: 'Client Relationship Builder',
    description: 'Stay top-of-mind with past clients and build referral pipeline',
    icon: <Heart className="h-5 w-5" />,
    outcomes: [
      'Market update newsletters',
      'Home anniversary messages',
      'Referral request sequences',
      'Neighborhood spotlights'
    ],
    channels: ['email', 'mail', 'social'],
    timeToValue: '1 minute',
    bestFor: ['experienced', 'luxury', 'volume'],
    examples: [
      {
        title: 'Anniversary Note',
        preview: 'Happy 2-year home anniversary! Here\'s what\'s happened in your neighborhood...'
      },
      {
        title: 'Market Update',
        preview: 'Your home value update: Good news for Brookfield homeowners!'
      },
      {
        title: 'Referral Request',
        preview: 'Know someone looking to buy or sell? I\'d love to help them too...'
      }
    ]
  },
  {
    id: 'business_building',
    name: 'Personal Brand Builder',
    description: 'Content that positions you as the local real estate expert',
    icon: <TrendingUp className="h-5 w-5" />,
    outcomes: [
      'Expert market commentary',
      'First-time buyer guides',
      'Local neighborhood expertise',
      'Success story showcases'
    ],
    channels: ['social', 'blog', 'email', 'video'],
    timeToValue: '3 minutes',
    bestFor: ['experienced', 'luxury', 'team_leader'],
    examples: [
      {
        title: 'Market Insight',
        preview: 'Why now is a great time to buy in Brookfield (3 key reasons)...'
      },
      {
        title: 'Buyer Guide',
        preview: 'First-time buyer? Here are 5 things I wish every client knew...'
      },
      {
        title: 'Success Story',
        preview: 'How we sold the Johnson\'s home in just 8 days...'
      }
    ]
  }
];

interface ContentTypeSelectorProps {
  selected: string[];
  onChange: (contentTypes: string[]) => void;
  userPersona?: RealtorPersona;
  className?: string;
}

export default function ContentTypeSelector_v2({ 
  selected, 
  onChange, 
  userPersona = 'experienced',
  className = ''
}: ContentTypeSelectorProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const toggleContentType = (typeId: string) => {
    if (selected.includes(typeId)) {
      onChange(selected.filter(id => id !== typeId));
    } else {
      onChange([...selected, typeId]);
    }
  };

  const toggleExpanded = (typeId: string) => {
    setExpandedType(expandedType === typeId ? null : typeId);
  };

  // Sort content types by relevance to user persona
  const sortedTypes = [...CONTENT_TYPES].sort((a, b) => {
    const aRelevance = a.bestFor.includes(userPersona) ? 1 : 0;
    const bRelevance = b.bestFor.includes(userPersona) ? 1 : 0;
    return bRelevance - aRelevance;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">What do you want to create?</h3>
          <p className="text-sm text-white/70 mt-1">Choose the content that matches your goals</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Clock className="h-4 w-4" />
          Quick results, professional quality
        </div>
      </div>

      <div className="space-y-3">
        {sortedTypes.map((contentType) => {
          const isSelected = selected.includes(contentType.id);
          const isExpanded = expandedType === contentType.id;
          const isRecommended = contentType.bestFor.includes(userPersona);

          return (
            <div
              key={contentType.id}
              className={`
                relative rounded-xl border transition-all cursor-pointer
                ${isSelected 
                  ? 'border-cyan-400/60 bg-cyan-400/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20'
                }
              `}
            >
              {isRecommended && (
                <div className="absolute -top-2 left-4 px-2 py-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 text-xs font-medium rounded-full">
                  Recommended for you
                </div>
              )}

              <div 
                className="p-4"
                onClick={() => toggleContentType(contentType.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${isSelected 
                      ? 'bg-cyan-400/20 text-cyan-300' 
                      : 'bg-white/10 text-white/70'
                    }
                  `}>
                    {contentType.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{contentType.name}</h4>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                        {contentType.timeToValue}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-cyan-400" />}
                    </div>
                    
                    <p className="text-sm text-white/70 mb-3">
                      {contentType.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {contentType.outcomes.slice(0, 2).map((outcome, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full"
                        >
                          {outcome}
                        </span>
                      ))}
                      {contentType.outcomes.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(contentType.id);
                          }}
                          className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1"
                        >
                          +{contentType.outcomes.length - 2} more
                        </button>
                      )}
                    </div>

                    {/* Channel indicators */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">Includes:</span>
                      <div className="flex gap-1">
                        {contentType.channels.includes('mls') && <FileText className="h-3 w-3 text-white/60" />}
                        {contentType.channels.includes('instagram') && <Instagram className="h-3 w-3 text-white/60" />}
                        {contentType.channels.includes('email') && <Mail className="h-3 w-3 text-white/60" />}
                        {contentType.channels.includes('facebook') && <Facebook className="h-3 w-3 text-white/60" />}
                        {contentType.channels.includes('video') && <Video className="h-3 w-3 text-white/60" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-white/10 p-4 bg-white/5">
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">What you&rsquo;ll get:</h5>
                      <ul className="space-y-1">
                        {contentType.outcomes.map((outcome, index) => (
                          <li key={index} className="text-xs text-white/70 flex items-center gap-2">
                            <Check className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">Sample outputs:</h5>
                      <div className="space-y-2">
                        {contentType.examples.map((example, index) => (
                          <div key={index} className="bg-neutral-950/50 rounded-lg p-3">
                            <div className="text-xs font-medium text-white/80 mb-1">
                              {example.title}
                            </div>
                            <div className="text-xs text-white/60 italic">
                              &ldquo;{example.preview}&rdquo;
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="mt-6 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">
              Selected: {selected.length} content type{selected.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-cyan-200/80">
            We&rsquo;ll create all the content you need for these goals. You can always add more later.
          </p>
        </div>
      )}
    </div>
  );
}