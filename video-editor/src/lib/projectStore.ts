import fs from 'fs';
import path from 'path';
import { WMPVProjectData } from '@/core/project/ProjectTypes';
import { RESIZE_OPTIONS } from '@/types';

// We'll store projects in a local JSON file for the prototype
const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Our internal shape for stored projects
export interface StoredProject {
    id: string;
    createdAt: number;
    updatedAt: number;
    data: WMPVProjectData;
}

// Helper to get all projects
export function getProjects(): Record<string, StoredProject> {
    if (!fs.existsSync(PROJECTS_FILE)) {
        return {};
    }
    try {
        const fileContent = fs.readFileSync(PROJECTS_FILE, 'utf-8');
        return JSON.parse(fileContent) as Record<string, StoredProject>;
    } catch (e) {
        console.error("Failed to read projects file:", e);
        return {};
    }
}

// Helper to save entire projects map
export function saveProjects(projects: Record<string, StoredProject>): void {
    try {
        fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
    } catch (e) {
        console.error("Failed to save projects to file:", e);
    }
}

// Helper to create an empty project
export function createEmptyProjectData(name: string = "Untitled Project"): WMPVProjectData {
    return {
        name,
        dimension: RESIZE_OPTIONS[3], // 16:9 1080p
        currentTime: 0,
        tracks: [
            {
                id: 'main-video',
                type: 'video',
                name: 'Main Video',
                items: []
            },
            {
                id: 'audio-track-1',
                type: 'audio',
                name: 'Audio 1',
                items: []
            },
            {
                id: 'overlay-track-1',
                type: 'overlay',
                name: 'Overlay Track 1',
                items: []
            }
        ],
        uploads: []
    };
}
