import { EditorShell } from '@/components/editor/EditorShell';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function Home() {
  return (
    <AuthProvider>
      <EditorShell />
    </AuthProvider>
  );
}
