'use client';

import { Bookmark } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { ExternalLink, Tag, Trash2 } from 'lucide-react';
import { MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
    onOpen: (url: string) => void;
}

export function BookmarkCard({ bookmark, onDelete, onOpen }: BookmarkCardProps) {
    // Extract domain for favicon and display
    const domain = new URL(bookmark.url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    // Format date
    const date = new Date(bookmark.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        onDelete(bookmark.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
            onClick={() => onOpen(bookmark.url)}
        >
            {/* Glossy overlay effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Favicon */}
                    <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border">
                        <img
                            src={faviconUrl}
                            alt={domain}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/globe.svg'; // Fallback
                            }}
                        />
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate max-w-[200px]" title={bookmark.title}>
                            {bookmark.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            {domain}
                        </p>
                    </div>
                </div>

                {/* Delete Button (Visible on hover) */}
                <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all -mr-1 ml-auto"
                    title="Delete Bookmark"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Description / Content (Optional part) */}

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground relative z-10">
                <div className="flex items-center gap-2">
                    {/* Tags (if any) */}
                    {bookmark.tags && bookmark.tags.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                            {bookmark.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border text-[10px]">
                                    #{tag}
                                </span>
                            ))}
                            {bookmark.tags.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">+{bookmark.tags.length - 2}</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-[10px] italic opacity-50">No tags</span>
                    )}
                </div>

                <span className="opacity-60">{date}</span>
            </div>
        </motion.div>
    );
}
