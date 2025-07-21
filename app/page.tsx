'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, FileText, Plus, ArrowRight, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { Page, Category } from '@/types';
import { fetchData } from '@/lib/api';

export default function HomePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [appTitle, setAppTitle] = useState('');

  const loadData = useCallback(async () => {
    try {
      const data = await fetchData();
      setPages(data.pages);
      setCategories(data.categories.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const appState = process.env.NEXT_PUBLIC_APP_STATE;
    setIsEditMode(appState === 'edit');
    setAppTitle(process.env.NEXT_PUBLIC_APP_TITLE || 'Atom Docs');
    loadData();
  }, [loadData]);

  const recentPages = pages
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isEditMode={isEditMode} />
        <div className="flex">
          <Sidebar isEditMode={isEditMode} />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="h-12 bg-muted rounded-lg w-1/2 mb-4"></div>
                <div className="h-6 bg-muted rounded w-1/3 mb-8"></div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isEditMode={isEditMode} />

      <div className="flex">
        <Sidebar isEditMode={isEditMode} />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Welcome to {appTitle}
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your comprehensive documentation space powered by Supabase. 
                Explore our knowledge base, find answers, and discover new insights.
              </p>
              
              {isEditMode && (
                <div className="flex justify-center gap-4">
                  <Button asChild size="lg">
                    <Link href="/admin">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Content
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/admin">
                      Manage Documentation
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="glass-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Documentation pages
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Content categories
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentPages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Recently updated
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Categories Overview */}
            {categories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => {
                    const categoryPages = pages.filter(p => p.category === category.slug);
                    const IconComponent = category.icon && (LucideIcons as any)[category.icon] 
                      ? (LucideIcons as any)[category.icon] 
                      : BookOpen;

                    return (
                      <Card key={category.id} className="glass-hover cursor-pointer transition-all hover:shadow-lg">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <IconComponent 
                                className="h-6 w-6 text-primary" 
                                style={{ color: category.iconColor || 'currentColor' }}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <Badge variant="secondary" className="mt-1">
                                {categoryPages.length} pages
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        {category.description && (
                          <CardContent>
                            <CardDescription>{category.description}</CardDescription>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Pages */}
            {recentPages.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Recent Updates</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPages.map((page) => {
                    const IconComponent = page.icon && (LucideIcons as any)[page.icon] 
                      ? (LucideIcons as any)[page.icon] 
                      : FileText;

                    return (
                      <Card key={page.id} className="glass-hover">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <IconComponent 
                                className="h-5 w-5 text-primary flex-shrink-0" 
                                style={{ color: page.iconColor || 'currentColor' }}
                              />
                              <CardTitle className="text-base line-clamp-2">
                                <Link 
                                  href={`/docs/${page.slug}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {page.title}
                                </Link>
                              </CardTitle>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {page.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(page.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        {page.description && (
                          <CardContent>
                            <CardDescription className="line-clamp-2">
                              {page.description}
                            </CardDescription>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {page.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {page.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{page.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {pages.length === 0 && categories.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Content Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first category and page.
                </p>
                {isEditMode && (
                  <Button asChild>
                    <Link href="/admin">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Page
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}