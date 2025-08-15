import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    return NextResponse.json({
      openaiConfigured: !!openaiApiKey && openaiApiKey.length > 0,
      keyLength: openaiApiKey ? openaiApiKey.length : 0,
      keyPrefix: openaiApiKey ? `${openaiApiKey.substring(0, 7)}...` : 'Not set',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      openaiConfigured: false,
      error: 'Failed to check configuration',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}