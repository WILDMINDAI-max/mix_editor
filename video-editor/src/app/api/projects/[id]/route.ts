import { NextResponse } from 'next/server';
import { getProjects, saveProjects } from '@/lib/projectStore';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const projectsMap = getProjects();
        const project = projectsMap[params.id];

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const projectsMap = getProjects();
        const project = projectsMap[params.id];

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const body = await req.json();
        const { data } = body;

        if (!data) {
            return NextResponse.json({ error: 'No data provided to update' }, { status: 400 });
        }

        // Update project state
        project.data = data;
        project.updatedAt = Date.now();
        
        // Name update fallback
        if (data.name) {
            project.data.name = data.name;
        }

        projectsMap[params.id] = project;
        saveProjects(projectsMap);

        return NextResponse.json({ success: true, updatedAt: project.updatedAt });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const projectsMap = getProjects();
        if (!projectsMap[params.id]) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        delete projectsMap[params.id];
        saveProjects(projectsMap);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
