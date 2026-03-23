import { NextResponse } from 'next/server';
import { getImageProjects, saveImageProjects } from '@/lib/projectStore';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const projectsMap = getImageProjects();
        const project = projectsMap[params.id];
        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        return NextResponse.json({ project });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const projectsMap = getImageProjects();
        const project = projectsMap[params.id];
        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

        const body = await req.json();
        if (!body?.data) return NextResponse.json({ error: 'No data provided' }, { status: 400 });

        project.data = body.data;
        project.updatedAt = Date.now();
        projectsMap[params.id] = project;
        saveImageProjects(projectsMap);

        return NextResponse.json({ success: true, updatedAt: project.updatedAt });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const projectsMap = getImageProjects();
        if (!projectsMap[params.id]) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        delete projectsMap[params.id];
        saveImageProjects(projectsMap);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
