/**
 * CustomBlendRenderer.ts
 * 
 * Provides real-time pixel-level blending for custom blend modes in Fabric.js
 * This renderer intercepts after each layer is drawn and applies the correct blend formula
 */

import { BlendMode } from '@/types/canvas';
import { blendPixels, isCustomBlendMode } from './BlendModes';

/**
 * Apply custom blend mode to a fabric object by rendering with pixel blending
 * This is called by the modified object _render methods for custom blend modes
 */
export function applyCustomBlendMode(
    ctx: CanvasRenderingContext2D,
    objectCanvas: HTMLCanvasElement,
    blendMode: BlendMode,
    opacity: number,
    x: number,
    y: number,
    width: number,
    height: number
): void {
    // Get the current canvas content (background/layers below)
    const bottomImageData = ctx.getImageData(x, y, width, height);

    // Get the object's rendered content
    const objectCtx = objectCanvas.getContext('2d')!;
    const topImageData = objectCtx.getImageData(0, 0, width, height);

    // Create result image data
    const resultData = ctx.createImageData(width, height);

    // Blend each pixel
    for (let i = 0; i < bottomImageData.data.length; i += 4) {
        const topR = topImageData.data[i];
        const topG = topImageData.data[i + 1];
        const topB = topImageData.data[i + 2];
        const topA = topImageData.data[i + 3] / 255;

        const bottomR = bottomImageData.data[i];
        const bottomG = bottomImageData.data[i + 1];
        const bottomB = bottomImageData.data[i + 2];
        const bottomA = bottomImageData.data[i + 3] / 255;

        if (topA === 0) {
            // Top pixel is transparent, keep bottom
            resultData.data[i] = bottomR;
            resultData.data[i + 1] = bottomG;
            resultData.data[i + 2] = bottomB;
            resultData.data[i + 3] = bottomImageData.data[i + 3];
        } else {
            // Apply blend mode
            const effectiveOpacity = topA * opacity;
            const [r, g, b] = blendPixels(
                topR, topG, topB,
                bottomR, bottomG, bottomB,
                effectiveOpacity,
                blendMode
            );

            resultData.data[i] = r;
            resultData.data[i + 1] = g;
            resultData.data[i + 2] = b;
            resultData.data[i + 3] = Math.round(Math.min(1, bottomA + effectiveOpacity) * 255);
        }
    }

    // Put the blended result back
    ctx.putImageData(resultData, x, y);
}

/**
 * Render a single object with custom blend mode
 * Creates a temporary canvas, renders the object, then blends it with the main canvas
 */
export function renderObjectWithCustomBlend(
    mainCtx: CanvasRenderingContext2D,
    object: fabric.Object,
    blendMode: BlendMode,
    canvasWidth: number,
    canvasHeight: number
): void {
    // Skip if not a custom blend mode
    if (!isCustomBlendMode(blendMode)) {
        return;
    }

    // Get object bounding box
    const bounds = object.getBoundingRect();
    const x = Math.max(0, Math.floor(bounds.left));
    const y = Math.max(0, Math.floor(bounds.top));
    const width = Math.min(canvasWidth - x, Math.ceil(bounds.width) + 2);
    const height = Math.min(canvasHeight - y, Math.ceil(bounds.height) + 2);

    if (width <= 0 || height <= 0) return;

    // Create temporary canvas for the object
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;

    // Translate to render at correct position
    tempCtx.translate(-x, -y);

    // Render the object to temp canvas with normal blend mode
    const originalGCO = object.globalCompositeOperation;
    object.globalCompositeOperation = 'source-over';
    object.render(tempCtx);
    object.globalCompositeOperation = originalGCO;

    // Reset translation
    tempCtx.setTransform(1, 0, 0, 1, 0, 0);

    // Apply custom blending
    applyCustomBlendMode(
        mainCtx,
        tempCanvas,
        blendMode,
        object.opacity || 1,
        x,
        y,
        width,
        height
    );
}

/**
 * Process all objects with custom blend modes after initial render
 * This is meant to be called as a post-processing step
 */
export function applyCustomBlendModesToCanvas(
    canvas: fabric.Canvas,
    elementBlendModes: Map<string, BlendMode>
): void {
    const ctx = canvas.getContext();
    if (!ctx) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const objects = canvas.getObjects();

    for (const obj of objects) {
        const id = (obj as any).data?.id;
        if (!id) continue;

        const blendMode = elementBlendModes.get(id);
        if (!blendMode || !isCustomBlendMode(blendMode)) continue;

        renderObjectWithCustomBlend(ctx, obj, blendMode, canvasWidth, canvasHeight);
    }
}
