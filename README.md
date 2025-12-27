# mix_editor

A unified editor combining both image editing (designer) and video editing capabilities.

## Structure

- `designer/` - Image editor (runs on port 3005)
- `video-editor/` - Video editor (runs on port 3000)

## Getting Started

### Designer (Image Editor)
```bash
cd designer
npm install
npm run dev
```

### Video Editor
```bash
cd video-editor
npm install
npm run dev
```

## Backend Requirements

Both editors require the following services to be running:
- `api-gateway-services-wildmind` - Backend API
- `wild` - Frontend application
