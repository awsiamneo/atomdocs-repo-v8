import { NextRequest, NextResponse } from 'next/server';
import { saveCategory as saveCategoryToStorage } from '@/lib/storage';
import { Category } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const category: Category = await request.json();
    saveCategoryToStorage(category);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving category:', error);
    return NextResponse.json(
      { error: 'Failed to save category' },
      { status: 500 }
    );
  }
}