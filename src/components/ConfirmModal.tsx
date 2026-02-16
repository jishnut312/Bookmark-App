'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    loading?: boolean;
    variant?: 'danger' | 'default';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    loading = false,
    variant = 'default'
}: ConfirmModalProps) {

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

                    {/* Backdrop */}
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
                        className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4 border border-border">
                                <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-destructive' : 'text-primary'}`} />
                            </div>

                            <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                {description}
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors min-w-[100px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px] shadow-lg hover:-translate-y-0.5 ${variant === 'danger'
                                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/25'
                                            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        confirmText
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
