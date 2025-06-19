import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  
  return NextResponse.json({ 
    message: `Content validation for type: ${type}`,
    status: 'placeholder'
  })
}