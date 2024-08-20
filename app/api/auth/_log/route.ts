// app/api/auth/_log/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const logData = await req.json();

  console.log('Log received:', logData); // Puedes manejar esto de manera más sofisticada si es necesario

  return NextResponse.json({ message: 'Log received successfully' });
}
