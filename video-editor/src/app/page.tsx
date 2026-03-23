"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Plus, Video, Loader2, Clock, X, Trash2 } from 'lucide-react';

interface ProjectMeta {
    id: string;
    name: string;
    dimension: { width: number; height: number };
    createdAt: number;
    updatedAt: number;
    thumbnail: string | null;
}

function DashboardContent() {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Create Project Modal State
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
        if (!trimmedName) {
            setCreateError('Project name cannot be empty');
            return;
        }

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
        } catch (err) {
            console.error("Failed to create project", err);
            setCreateError('A network error occurred');
            setIsCreating(false);
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setProjects(prev => prev.filter(p => p.id !== id));
                } else {
                    alert('Failed to delete project');
                }
            } catch (err) {
                console.error("Failed to delete", err);
                alert('A network error occurred');
            }
        }
    };

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#0e1318] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12 border-b border-[#252627] pb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Video Projects</h1>
                        <p className="text-gray-400">Manage and create stunning video designs.</p>
                    </div>
                    <button 
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={20} />
                        New Project
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-gray-500" size={40} />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#16181a] rounded-xl border border-[#252627] border-dashed">
                        <Video size={48} className="text-gray-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                        <p className="text-gray-400 mb-6">Create your first video project to get started.</p>
                        <button 
                            onClick={handleOpenCreateModal}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-700"
                        >
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {projects.map(project => (
                            <div 
                                key={project.id}
                                onClick={() => router.push(`/editor/${project.id}`)}
                                className="bg-[#16181a] rounded-xl overflow-hidden border border-[#252627] hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-900/10 group flex flex-col h-64"
                            >
                                <div className="h-40 bg-[#1f2021] flex items-center justify-center relative overflow-hidden">
                                    {project.thumbnail ? (
                                        <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <Video size={32} className="text-gray-600" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium tracking-wide">
                                            Open Editor
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-1 relative">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-semibold text-lg truncate mb-1" title={project.name}>{project.name}</h3>
                                        <button 
                                            onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                                            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors shrink-0"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                                        <Clock size={12} />
                                        <span>Edited {formatDate(project.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-[#16181a] rounded-xl w-full max-w-md border border-[#252627] shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-[#252627]">
                            <h2 className="text-lg font-semibold">Create New Project</h2>
                            <button 
                                onClick={() => !isCreating && setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                                disabled={isCreating}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateSubmit} className="p-5">
                            <div className="mb-4">
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="projectName"
                                    type="text"
                                    autoFocus
                                    value={newProjectName}
                                    onChange={(e) => {
                                        setNewProjectName(e.target.value);
                                        setCreateError(''); // Clear error on typing
                                    }}
                                    disabled={isCreating}
                                    placeholder="e.g. Summer Vacation Edit"
                                    className="w-full bg-[#1f2021] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                                {createError && (
                                    <p className="text-red-400 text-sm mt-2">{createError}</p>
                                )}
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    disabled={isCreating}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1f2021] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || !newProjectName.trim()}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
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
