import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  icon_color: string | null;
  order_index: number;
  created_at: string;
}

export interface DatabasePage {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  icon: string | null;
  icon_color: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}