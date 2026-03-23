import { NextResponse } from 'next/server';
import { getImageProjects, saveImageProjects, createEmptyImageProject, StoredImageProject } from '@/lib/projectStore';
import crypto from 'crypto';

export async function GET() {
    try {
        const projectsMap = getImageProjects();
        const projectsList = Object.values(projectsMap).sort((a, b) => b.updatedAt - a.updatedAt);

        const metadataList = projectsList.map(p => ({
            id: p.id,
            name: p.data.name,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            thumbnail: p.data.pages?.[0]?.thumbnail || null,
            pageCount: p.data.pages?.length || 1,
        }));

        return NextResponse.json({ projects: metadataList });
    } catch (error) {
        console.error("Error fetching image projects:", error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const projectsMap = getImageProjects();
        const id = crypto.randomUUID();

        let name = 'Untitled Design';
        try {
            const body = await req.json();
            if (body?.name) name = body.name.trim();
        } catch { /* no body */ }

        if (!name) {
            return NextResponse.json({ error: 'Project name cannot be empty' }, { status: 400 });
        }

        const isDuplicate = Object.values(projectsMap).some(
            p => p.data.name.toLowerCase() === name.toLowerCase()
        );
        if (isDuplicate) {
            return NextResponse.json({ error: 'A project with this name already exists.' }, { status: 400 });
        }

        const now = Date.now();
        const projectData = createEmptyImageProject(name);
        // Override the id with our own so it matches the route
        projectData.id = id;

        const newProject: StoredImageProject = { id, createdAt: now, updatedAt: now, data: projectData };
        projectsMap[id] = newProject;
        saveImageProjects(projectsMap);

        return NextResponse.json({ project: { id, name } }, { status: 201 });
    } catch (error) {
        console.error("Error creating image project:", error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
