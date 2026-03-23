import { EditorShell } from '@/components/editor/EditorShell';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function EditorWorkspacePage({ params }: { params: { id: string } }) {
    return (
        <AuthProvider>
            <EditorShell projectId={params.id} />
        </AuthProvider>
    );
}
