import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const DATA_FILE = path.join(process.cwd(), 'data.json');
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    
    return NextResponse.json({
      pages: parsedData.pages || [],
      categories: parsedData.categories || []
    });
  } catch (error) {
    console.error('Error reading initial data:', error);
    // Return empty structure as fallback
    return NextResponse.json({
      pages: [],
      categories: []
    });
  }
}