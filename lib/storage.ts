import { promises as fs } from 'fs';
import path from 'path';
import { Category, Page, AppState } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export async function getStorageData(): Promise<AppState> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    
    // Ensure the data has the correct structure
    return {
      pages: parsedData.pages || [],
      categories: parsedData.categories || []
    };
  } catch (error) {
    console.error('Error reading data file:', error);
    // If file doesn't exist or is invalid, return empty structure
    return {
      pages: [],
      categories: []
    };
  }
}

export async function saveStorageData(data: AppState): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function savePage(page: Page): Promise<void> {
  const data = await getStorageData();
  const existingIndex = data.pages.findIndex(p => p.id === page.id);
  
  if (existingIndex >= 0) {
    data.pages[existingIndex] = page;
  } else {
    data.pages.push(page);
  }
  
  await saveStorageData(data);
}

export async function deletePage(pageId: string): Promise<void> {
  const data = await getStorageData();
  data.pages = data.pages.filter(p => p.id !== pageId);
  await saveStorageData(data);
}

export async function saveCategory(category: Category): Promise<void> {
  const data = await getStorageData();
  const existingIndex = data.categories.findIndex(c => c.id === category.id);
  
  if (existingIndex >= 0) {
    data.categories[existingIndex] = category;
  } else {
    data.categories.push(category);
  }
  
  await saveStorageData(data);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const data = await getStorageData();
  data.categories = data.categories.filter(c => c.id !== categoryId);
  await saveStorageData(data);
}