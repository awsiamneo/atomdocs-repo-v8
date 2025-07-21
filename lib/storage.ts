import { Category, Page, AppState } from '@/types';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';
const STORAGE_KEY = 'atom-docs-data';

export async function getStorageData(): Promise<AppState> {
  // In browser environment, use localStorage
  if (isBrowser) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        return {
          pages: parsedData.pages || [],
          categories: parsedData.categories || []
        };
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    
    // If no data in localStorage, try to load initial data from API
    try {
      const response = await fetch('/api/initial-data');
      if (response.ok) {
        const initialData = await response.json();
        // Save to localStorage for future use
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
    
    // Return empty structure as fallback
    return {
      pages: [],
      categories: []
    };
  }
  
  // Server-side: try to read from file system (development only)
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const DATA_FILE = path.join(process.cwd(), 'data.json');
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
  // In browser environment, use localStorage
  if (isBrowser) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data to localStorage');
    }
  }
  
  // Server-side: try to write to file system (development only)
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const DATA_FILE = path.join(process.cwd(), 'data.json');
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to file system:', error);
    // In production, this will fail silently since we're using localStorage
  }
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