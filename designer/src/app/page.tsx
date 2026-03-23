"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Plus, ImageIcon, Loader2, Clock, X, Trash2, FileImage } from 'lucide-react';

interface ProjectMeta {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    thumbnail: string | null;
    pageCount: number;
}

function DashboardContent() {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [createError, setCreateError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data.projects || []);
                }
            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleOpenCreateModal = () => {
        setNewProjectName('');
        setCreateError('');
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newProjectName.trim();
        if (!trimmedName) { setCreateError('Project name cannot be empty'); return; }

        setIsCreating(true);
        setCreateError('');
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmedName })
            });
            const data = await res.json();
            if (res.ok) {
                setIsCreateModalOpen(false);
                router.push(`/editor/${data.project.id}`);
            } else {
                setCreateError(data.error || 'Failed to create project');
                setIsCreating(false);
            }
        } catch {
            setCreateError('A network error occurred');
            setIsCreating(false);
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            try {
                const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
                if (res.ok) setProjects(prev => prev.filter(p => p.id !== id));
                else alert('Failed to delete project');
            } catch { alert('A network error occurred'); }
        }
    };

    const formatDate = (ts: number) =>
        new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-8 py-10">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">My Design Projects</h1>
                        <p className="text-gray-500">Create and manage your image designs.</p>
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        New Design
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-gray-400" size={40} />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                        <FileImage size={52} className="text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h2>
                        <p className="text-gray-400 mb-6">Start a new design project to get going.</p>
                        <button
                            onClick={handleOpenCreateModal}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            Create Design
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                onClick={() => router.push(`/editor/${project.id}`)}
                                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-violet-400 cursor-pointer transition-all hover:shadow-lg group flex flex-col"
                            >
                                <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                    {project.thumbnail ? (
                                        <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <ImageIcon size={36} className="text-gray-300" />
                                    )}
                                    <div className="absolute inset-0 bg-violet-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-semibold tracking-wide text-sm">Open Editor</span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <h3 className="font-medium text-sm truncate text-gray-800" title={project.name}>{project.name}</h3>
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                                            className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors shrink-0"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={11} />
                                        <span>{formatDate(project.updatedAt)}</span>
                                        {project.pageCount > 1 && (
                                            <span className="ml-auto bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{project.pageCount}p</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">New Design Project</h2>
                            <button onClick={() => !isCreating && setIsCreateModalOpen(false)} disabled={isCreating} className="text-gray-400 hover:text-gray-700 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="p-5">
                            <div className="mb-5">
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="projectName"
                                    type="text"
                                    autoFocus
                                    value={newProjectName}
                                    onChange={(e) => { setNewProjectName(e.target.value); setCreateError(''); }}
                                    disabled={isCreating}
                                    placeholder="e.g. Summer Sale Poster"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                                {createError && <p className="text-red-500 text-sm mt-2">{createError}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isCreating} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || !newProjectName.trim()}
                                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {isCreating && <Loader2 className="animate-spin" size={16} />}
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Home() {
    return (
        <AuthProvider>
            <DashboardContent />
        </AuthProvider>
    );
}
