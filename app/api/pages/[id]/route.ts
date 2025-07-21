import { NextRequest, NextResponse } from 'next/server';
import { deletePage as deletePageFromStorage } from '@/lib/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    deletePageFromStorage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}