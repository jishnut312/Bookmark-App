'use client';

import { User } from '@supabase/supabase-js';
import { Bookmark, Star, Tag, LogOut, LayoutGrid, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    user: User | null;
    signOut: () => void;
    activeView: string;
    setActiveView: (view: string) => void;
    setShowAddModal: (show: boolean) => void;
}

export function Sidebar({ user, signOut, activeView, setActiveView, setShowAddModal }: SidebarProps) {
    const navItems = [
        { id: 'all', label: 'All Bookmarks', icon: LayoutGrid },
        { id: 'favorites', label: 'Favorites', icon: Star },
        { id: 'tags', label: 'Tags', icon: Tag },
    ];

    return (
        <div className="w-64 h-screen border-r border-border bg-card flex flex-col fixed left-0 top-0">
            {/* App Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">Bookmarks</span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            activeView === item.id
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-border">
                {user ? (
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group relative">
                        {/* User Avatar */}
                        {user.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="w-8 h-8 rounded-full border border-border"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold border border-border">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">
                                {user.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </div>

                        {/* Logout Button (Hidden until hover) */}
                        <button
                            onClick={signOut}
                            className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-background rounded-md transition-all text-muted-foreground hover:text-destructive"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="h-12 bg-secondary/50 animate-pulse rounded-md" />
                )}
            </div>

            {/* Mobile Add Button (Visible only on small screens via CSS elsewhere, but here for structure) */}
        </div>
    );
}
