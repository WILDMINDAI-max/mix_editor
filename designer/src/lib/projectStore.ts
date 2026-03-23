import fs from 'fs';
import path from 'path';
import { Project, createDefaultProject } from '@/types/project';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'image-projects.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface StoredImageProject {
    id: string;
    createdAt: number;
    updatedAt: number;
    data: Project;
}

export function getImageProjects(): Record<string, StoredImageProject> {
    if (!fs.existsSync(PROJECTS_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8')) as Record<string, StoredImageProject>;
    } catch {
        return {};
    }
}

export function saveImageProjects(projects: Record<string, StoredImageProject>): void {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

export function createEmptyImageProject(name: string = 'Untitled Design'): Project {
    const project = createDefaultProject();
    project.name = name;
    return project;
}
