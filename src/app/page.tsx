'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase, type Bookmark } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Sidebar } from '@/components/Sidebar';
import { BookmarkCard } from '@/components/BookmarkCard';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';
import { AuthScreen } from '@/components/AuthScreen';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Loader2, Search, Plus, BookmarkX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  }, [user]);

  // Real-time Subscription
  useEffect(() => {
    if (!user) return;

    fetchBookmarks();

    const channel = supabase
      .channel('realtime_bookmarks')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks(prev => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setBookmarks(prev => prev.filter(b => b.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks(prev => prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b));
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime Status:', status);
      });

    return () => {
      supabase.removeChannel(channel).catch(() => { });
    };
  }, [user, fetchBookmarks]);

  // Filter Bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      if (activeView === 'favorites') return matchesSearch;
      if (activeView === 'tags') return matchesSearch;

      return matchesSearch;
    });
  }, [bookmarks, searchQuery, activeView]);

  // Action Handlers
  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from('bookmarks').delete().eq('id', deleteId);
    if (error) {
      console.error('Delete error:', error);
      alert('Failed to delete bookmark');
    } else {
      fetchBookmarks(); // Immediate refresh
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const confirmSignOut = async () => {
    await supabase.auth.signOut();
    setShowSignOutModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">

      {/* Sidebar (Hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar
          user={user}
          signOut={() => setShowSignOutModal(true)}
          activeView={activeView}
          setActiveView={setActiveView}
          setShowAddModal={setShowAddModal}
        />
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64 flex-1 p-4 md:p-8 h-screen overflow-y-auto w-full relative">

        {/* Top Bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-8 sticky top-0 bg-background/80 backdrop-blur-md z-40 py-4 -mt-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all text-foreground"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bookmark</span>
          </button>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-4 sticky top-0 bg-background/95 backdrop-blur-md z-40 py-4 -mx-4 px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Bookmarks</h1>
          </div>

          <button
            onClick={() => setShowSignOutModal(true)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold ring-2 ring-background overflow-hidden border border-border">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : user.email?.[0].toUpperCase()}
            </div>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* View Title */}
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight capitalize text-foreground">
            {activeView === 'all' ? 'All Bookmarks' : activeView}
          </h1>
          <p className="text-muted-foreground text-sm">
            {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
            <AnimatePresence>
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={() => setDeleteId(bookmark.id)} // Open modal instead of deleting directly
                  onOpen={(url) => window.open(url, '_blank')}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="p-4 bg-secondary/50 rounded-full mb-4">
              <BookmarkX className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">No bookmarks found</p>
            <p className="text-sm opacity-60">Try searching or adding a new one.</p>
          </div>
        )}

        {/* Mobile FAB */}
        <button
          onClick={() => setShowAddModal(true)}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50 shadow-primary/25"
        >
          <Plus className="w-6 h-6" />
        </button>

      </main>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onBookmarkAdded={() => {
          fetchBookmarks();
          setShowAddModal(false);
        }}
        userId={user.id}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Bookmark?"
        description="Are you sure you want to delete this bookmark? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
      />

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={confirmSignOut}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        variant="default"
      />
    </div>
  );
}
