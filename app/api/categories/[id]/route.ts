import { NextRequest, NextResponse } from 'next/server';
import { deleteCategory as deleteCategoryFromStorage } from '@/lib/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    deleteCategoryFromStorage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}