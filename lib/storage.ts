import { Category, Page, AppState } from '@/types';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';
const STORAGE_KEY = 'atom-docs-data';

// Default data structure
const defaultData: AppState = {
  pages: [],
  categories: []
};

export async function getStorageData(): Promise<AppState> {
  // In development, try to read from file system first
  if (process.env.NODE_ENV === 'development' && !isBrowser) {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      const DATA_FILE = path.join(process.cwd(), 'data.json');
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      
      return {
        pages: parsedData.pages || [],
        categories: parsedData.categories || []
      };
    } catch (error) {
      console.error('Error reading data file:', error);
    }
  }

  // In browser environment (both dev and prod), use in-memory storage with persistence
  if (isBrowser) {
    // Check if we have data in sessionStorage first (survives page reloads)
    try {
      const sessionData = sessionStorage.getItem(STORAGE_KEY);
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        return {
          pages: parsedData.pages || [],
          categories: parsedData.categories || []
        };
      }
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
    }

    // If no session data, try to load from the initial data endpoint
    try {
      const response = await fetch('/api/initial-data');
      if (response.ok) {
        const initialData = await response.json();
        // Save to sessionStorage for this session
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        } catch (error) {
          console.error('Error saving to sessionStorage:', error);
        }
        return initialData;
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }
  
  // Fallback to default empty structure
  return defaultData;
}

export async function saveStorageData(data: AppState): Promise<void> {
  // In development, save to file system
  if (process.env.NODE_ENV === 'development' && !isBrowser) {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      const DATA_FILE = path.join(process.cwd(), 'data.json');
      await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to file system:', error);
    }
  }

  // In browser environment, save to sessionStorage
  if (isBrowser) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      throw new Error('Failed to save data');
    }
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