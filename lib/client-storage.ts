import { AppState, Page, Category } from '@/types';
import { fetchData, saveData, savePage as savePageAPI, deletePage as deletePageAPI, saveCategory as saveCategoryAPI, deleteCategory as deleteCategoryAPI } from './api';

// Client-side storage functions that use API calls
export const getStorageData = async (): Promise<AppState> => {
  return await fetchData();
};

export const saveStorageData = async (data: AppState): Promise<void> => {
  await saveData(data);
};

export const savePage = async (page: Page): Promise<void> => {
  await savePageAPI(page);
};

export const deletePage = async (id: string): Promise<void> => {
  await deletePageAPI(id);
};

export const saveCategory = async (category: Category): Promise<void> => {
  await saveCategoryAPI(category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteCategoryAPI(id);
};

export const updateCategoryOrder = async (categories: Category[]): Promise<void> => {
  const data = await getStorageData();
  data.categories = categories;
  await saveStorageData(data);
};

export const updatePageOrder = async (pages: Page[]): Promise<void> => {
  const data = await getStorageData();
  data.pages = pages;
  await saveStorageData(data);
};