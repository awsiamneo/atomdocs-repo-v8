import { supabase, DatabaseCategory, DatabasePage } from './supabase';
import { Category, Page, AppState } from '@/types';

// Transform database category to app category
const transformCategory = (dbCategory: DatabaseCategory): Category => ({
  id: dbCategory.id,
  name: dbCategory.name,
  slug: dbCategory.slug,
  description: dbCategory.description,
  icon: dbCategory.icon || undefined,
  iconColor: dbCategory.icon_color || undefined,
  order: dbCategory.order_index,
  createdAt: dbCategory.created_at,
});

// Transform app category to database category
const transformCategoryForDB = (category: Category): Partial<DatabaseCategory> => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  icon: category.icon || null,
  icon_color: category.iconColor || null,
  order_index: category.order,
  created_at: category.createdAt,
});

// Transform database page to app page
const transformPage = (dbPage: DatabasePage): Page => ({
  id: dbPage.id,
  title: dbPage.title,
  slug: dbPage.slug,
  description: dbPage.description,
  category: dbPage.category,
  tags: dbPage.tags,
  content: dbPage.content,
  icon: dbPage.icon || undefined,
  iconColor: dbPage.icon_color || undefined,
  order: dbPage.order_index,
  createdAt: dbPage.created_at,
  updatedAt: dbPage.updated_at,
});

// Transform app page to database page
const transformPageForDB = (page: Page): Partial<DatabasePage> => ({
  id: page.id,
  title: page.title,
  slug: page.slug,
  description: page.description,
  category: page.category,
  tags: page.tags,
  content: page.content,
  icon: page.icon || null,
  icon_color: page.iconColor || null,
  order_index: page.order,
  created_at: page.createdAt,
  updated_at: page.updatedAt,
});

export async function getStorageData(): Promise<AppState> {
  try {
    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw categoriesError;
    }

    // Fetch pages
    const { data: pagesData, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .order('order_index');

    if (pagesError) {
      console.error('Error fetching pages:', pagesError);
      throw pagesError;
    }

    return {
      categories: (categoriesData || []).map(transformCategory),
      pages: (pagesData || []).map(transformPage),
    };
  } catch (error) {
    console.error('Error loading data from Supabase:', error);
    return {
      categories: [],
      pages: [],
    };
  }
}

export async function saveStorageData(data: AppState): Promise<void> {
  try {
    // Save categories
    if (data.categories.length > 0) {
      const { error: categoriesError } = await supabase
        .from('categories')
        .upsert(data.categories.map(transformCategoryForDB));

      if (categoriesError) {
        console.error('Error saving categories:', categoriesError);
        throw categoriesError;
      }
    }

    // Save pages
    if (data.pages.length > 0) {
      const { error: pagesError } = await supabase
        .from('pages')
        .upsert(data.pages.map(transformPageForDB));

      if (pagesError) {
        console.error('Error saving pages:', pagesError);
        throw pagesError;
      }
    }
  } catch (error) {
    console.error('Error saving data to Supabase:', error);
    throw error;
  }
}

export async function savePage(page: Page): Promise<void> {
  try {
    const { error } = await supabase
      .from('pages')
      .upsert(transformPageForDB(page));

    if (error) {
      console.error('Error saving page:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving page to Supabase:', error);
    throw error;
  }
}

export async function deletePage(pageId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId);

    if (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting page from Supabase:', error);
    throw error;
  }
}

export async function saveCategory(category: Category): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .upsert(transformCategoryForDB(category));

    if (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving category to Supabase:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting category from Supabase:', error);
    throw error;
  }
}