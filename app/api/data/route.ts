import { NextRequest, NextResponse } from 'next/server';
import { getStorageData, saveStorageData } from '@/lib/storage';
import { AppState } from '@/types';

export async function GET() {
  try {
    const data = await getStorageData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: AppState = await request.json();
    await saveStorageData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}