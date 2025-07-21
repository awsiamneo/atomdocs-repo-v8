'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchDialog } from '@/components/search-dialog';
import { Settings, BookOpen, Home } from 'lucide-react';

interface HeaderProps {
  isEditMode: boolean;
}

export function Header({ isEditMode }: HeaderProps) {
  const [appTitle, setAppTitle] = useState('');

  useEffect(() => {
    setAppTitle(process.env.NEXT_PUBLIC_APP_TITLE || 'Atom Docs');
  }, []);

  return (
    <header className="glass-header sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{appTitle}</span>
          </Link>
          
          <Badge variant="secondary" className="glass">
            Supabase
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <SearchDialog />
          
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            {isEditMode && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}