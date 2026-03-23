import VideoEditor from "@/components/VideoEditor";
import { AuthProvider } from "@/components/auth/AuthProvider";

export default function EditorPage({ params }: { params: { id: string } }) {
  return (
    <AuthProvider>
      <VideoEditor projectId={params.id} />
    </AuthProvider>
  );
}
