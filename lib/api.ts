import { AppState, Page, Category } from '@/types';

// Client-side API functions for interacting with the data
export const fetchData = async (): Promise<AppState> => {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return await response.json();
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
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save data');
    }
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
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