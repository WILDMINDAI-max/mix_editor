import { NextResponse } from 'next/server';
import { getProjects, saveProjects, createEmptyProjectData, StoredProject } from '@/lib/projectStore';
import crypto from 'crypto';

export async function GET() {
    try {
        const projectsMap = getProjects();
        // Return as an array sorted by most recently updated
        const projectsList = Object.values(projectsMap).sort((a, b) => b.updatedAt - a.updatedAt);
        
        // Don't send the entire massive payload string, just the metadata
        const metadataList = projectsList.map(p => ({
            id: p.id,
            name: p.data.name,
            dimension: p.data.dimension,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            thumbnail: p.data.tracks?.[0]?.items?.[0]?.thumbnail || null
        }));

        return NextResponse.json({ projects: metadataList });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const projectsMap = getProjects();
        const id = crypto.randomUUID();
        
        // Parse body for initial name
        let name = "Untitled Video Design";
        try {
            const body = await req.json();
            if (body && body.name) name = body.name.trim();
        } catch {
            // Ignore if no body provided
        }

        if (!name) {
            return NextResponse.json({ error: 'Project name cannot be empty' }, { status: 400 });
        }

        // Check for uniqueness
        const isDuplicate = Object.values(projectsMap).some(
            project => project.data.name.toLowerCase() === name.toLowerCase()
        );

        if (isDuplicate) {
            return NextResponse.json({ error: 'Project name must be unique. A project with this name already exists.' }, { status: 400 });
        }

        const now = Date.now();
        const newProject: StoredProject = {
            id,
            createdAt: now,
            updatedAt: now,
            data: createEmptyProjectData(name)
        };

        projectsMap[id] = newProject;
        saveProjects(projectsMap);

        return NextResponse.json({ project: { id, name: newProject.data.name } }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
