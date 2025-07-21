import { AppState, Page, Category } from '@/types';

// Client-side API functions for interacting with the data
export const fetchData = async (): Promise<AppState> => {
  // Check if we're in browser and have data in localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('atom-docs-data');
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
  }
  
  // Check if we're in browser and have data in localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('atom-docs-data');
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
  }
  
  try {
    // Try to get data from API first
    let response = await fetch('/api/data');
    
    // If API fails, try initial data endpoint
    if (!response.ok) {
      response = await fetch('/api/initial-data');
    }
    // Try to get data from API first
    let response = await fetch('/api/data');
    
    // If API fails, try initial data endpoint
    if (!response.ok) {
      response = await fetch('/api/initial-data');
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    
    // Save to localStorage for future use
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('atom-docs-data', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    
    const data = await response.json();
    
    // Save to localStorage for future use
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('atom-docs-data', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return default state as fallback
    return {
      pages: [],
      categories: []
    };
  }
};

export const saveData = async (data: AppState): Promise<void> => {
  // Save to localStorage first
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('atom-docs-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  // Try to save via API (will work in development, fail silently in production)
  // Save to localStorage first
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('atom-docs-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  // Try to save via API (will work in development, fail silently in production)
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Don't throw error if API fails in production
    if (!response.ok) {
      console.warn('API save failed, data saved to localStorage only');
    }
    }
  } catch (error) {
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Error saving data:', error);
      throw error;
    } else {
      console.warn('API save failed in production, data saved to session only');
    }
  }
};

export const savePage = async (page: Page): Promise<void> => {
  try {
    const response = await fetch('/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(page),
    });

    if (!response.ok) {
      throw new Error('Failed to save page');
    }
  } catch (error) {
    console.error('Error saving page:', error);
    throw error;
  }
};

export const deletePage = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/pages/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete page');
    }
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};

export const saveCategory = async (category: Category): Promise<void> => {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error('Failed to save category');
    }
  } catch (error) {
    console.error('Error saving category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};