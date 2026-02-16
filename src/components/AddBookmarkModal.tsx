'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AddBookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookmarkAdded: () => void;
    userId: string;
}

export function AddBookmarkModal({ isOpen, onClose, onBookmarkAdded, userId }: AddBookmarkModalProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !userId) return;

        setLoading(true);

        const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
        const finalTitle = title || new URL(url).hostname;

        let finalUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            finalUrl = 'https://' + url;
        }

        const { error } = await supabase.from('bookmarks').insert([
            {
                user_id: userId,
                title: finalTitle,
                url: finalUrl,
                tags: tagArray
            },
        ]);

        setLoading(false);

        if (error) {
            console.error('Error adding bookmark:', error);
            alert('Failed to add bookmark');
        } else {
            onBookmarkAdded();
            onClose();
            setUrl('');
            setTitle('');
            setTags('');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

                    {/* Backdrop with stronger blur for focus */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header Gradient Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600" />

                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Add Bookmark</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Save a new link to your collection.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground ml-1">URL <span className="text-primary">*</span></label>
                                    <div className="relative">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="https://example.com"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full px-4 py-3 bg-secondary/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground ml-1">Title <span className="text-muted-foreground text-xs">(Optional)</span></label>
                                    <input
                                        type="text"
                                        placeholder="My Awesome Website"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-secondary/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground ml-1">Tags <span className="text-muted-foreground text-xs">(Comma separated)</span></label>
                                    <input
                                        type="text"
                                        placeholder="design, inspiration, tools"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full px-4 py-3 bg-secondary/30 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                Add Bookmark
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
