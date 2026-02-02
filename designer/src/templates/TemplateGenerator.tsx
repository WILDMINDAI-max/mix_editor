import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { TemplateData } from './types';
import businessData from './data/business.json';
import documentsData from './data/documents.json';
import ecommerceData from './data/ecommerce.json';
import eventsData from './data/events.json';
import festivalData from './data/festival.json';
import foodRestaurantData from './data/food_restaurant.json';
import healthcareData from './data/healthcare.json';
import invitationData from './data/invitation.json';
import lifestyleData from './data/lifestyle.json';
import marketingData from './data/marketing.json';
import presentationData from './data/presentation.json';
import sportsFitnessData from './data/sports_fitness.json';
import technologyData from './data/technology.json';

// Combine all data sources
const allTemplates: TemplateData[] = [
    ...(businessData as TemplateData[]),
    ...(documentsData as TemplateData[]),
    ...(ecommerceData as TemplateData[]),
    ...(eventsData as TemplateData[]),
    ...(festivalData as TemplateData[]),
    ...(foodRestaurantData as TemplateData[]),
    ...(healthcareData as TemplateData[]),
    ...(invitationData as TemplateData[]),
    ...(lifestyleData as TemplateData[]),
    ...(marketingData as TemplateData[]),
    ...(presentationData as TemplateData[]),
    ...(sportsFitnessData as TemplateData[]),
    ...(technologyData as TemplateData[]),
];

export const TemplateGenerator: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    // Initialize Canvas
    useEffect(() => {
        if (canvasRef.current && !fabricCanvas) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: 1200,
                height: 1200,
                backgroundColor: '#ffffff',
            });
            setFabricCanvas(canvas);
        }
    }, [canvasRef, fabricCanvas]);

    // Logging helper
    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    // Main Generator Loop
    useEffect(() => {
        if (!isGenerating || !fabricCanvas || currentIndex < 0) return;

        if (currentIndex >= allTemplates.length) {
            setIsGenerating(false);
            addLog("DONE! All templates generated.");
            return;
        }

        const template = allTemplates[currentIndex];
        generateThumbnail(template);

    }, [currentIndex, isGenerating, fabricCanvas]);

    const startGeneration = () => {
        setIsGenerating(true);
        setCurrentIndex(0);
        addLog("Starting generation...");
    };

    const generateThumbnail = async (template: TemplateData) => {
        if (!fabricCanvas) return;

        addLog(`Rendering: ${template.name} (${template.id})...`);

        // 1. Resize Canvas
        fabricCanvas.setWidth(template.width);
        fabricCanvas.setHeight(template.height);
        fabricCanvas.setZoom(1);

        // 2. Clear & Set Background
        fabricCanvas.clear();
        if (template.background.type === 'solid') {
            fabricCanvas.setBackgroundColor(template.background.color, fabricCanvas.renderAll.bind(fabricCanvas));
        } else if (template.background.type === 'gradient') {
            // Handle Gradient
            if (template.background.gradientType === 'linear') {
                const gradient = new fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: fabricCanvas.width || 0, y2: fabricCanvas.height || 0 }, // Diagonal default
                    colorStops: template.background.colorStops.map((stop: any) => ({
                        offset: stop.offset,
                        color: stop.color
                    }))
                });
                fabricCanvas.setBackgroundColor(gradient, fabricCanvas.renderAll.bind(fabricCanvas));
            } else if (template.background.gradientType === 'radial') {
                const gradient = new fabric.Gradient({
                    type: 'radial',
                    coords: {
                        r1: 0,
                        r2: Math.max(fabricCanvas.width || 0, fabricCanvas.height || 0) / 1.5,
                        x1: (fabricCanvas.width || 0) / 2,
                        y1: (fabricCanvas.height || 0) / 2,
                        x2: (fabricCanvas.width || 0) / 2,
                        y2: (fabricCanvas.height || 0) / 2
                    },
                    colorStops: template.background.colorStops.map((stop: any) => ({
                        offset: stop.offset,
                        color: stop.color
                    }))
                });
                fabricCanvas.setBackgroundColor(gradient, fabricCanvas.renderAll.bind(fabricCanvas));
            }
        }

        // 3. Load Elements
        if (template.elements) {
            // Helper to map CanvasElement to Fabric options
            const mapElementAttributes = (el: any) => ({
                ...(el.transform || {}),
                left: el.transform?.x || 0,
                top: el.transform?.y || 0,
                fill: el.style?.fill === null ? 'transparent' : (el.style?.fill ?? '#000000'),
                opacity: el.style?.opacity ?? 1,
                stroke: el.style?.stroke || undefined,
                strokeWidth: el.style?.strokeWidth ?? 0,
                // Text specific
                fontSize: el.textStyle?.fontSize || 20,
                fontFamily: el.textStyle?.fontFamily || 'Arial',
                fontWeight: el.textStyle?.fontWeight || 'normal',
                fontStyle: el.textStyle?.fontStyle || 'normal',
                textAlign: el.textStyle?.textAlign || 'left',
                lineHeight: el.textStyle?.lineHeight || 1.2,
                charSpacing: (el.textStyle?.letterSpacing || 0) * 10,
                // Shape specific
                width: el.transform?.width || 100,
                height: el.transform?.height || 100,
                // Image specific
                src: el.src || '',
                // Origin - respect what's in transform, else default to center
                originX: el.transform?.originX || 'center',
                originY: el.transform?.originY || 'center',
                // Map rotation to angle (Fabric uses angle)
                angle: el.transform?.rotation || 0,
            });

            const sortedElements = [...template.elements].sort((a: any, b: any) => {
                return (a.zIndex || 0) - (b.zIndex || 0);
            });

            const imagePromises: Promise<void>[] = [];

            sortedElements.forEach((el: any) => {
                try {
                    const options = mapElementAttributes(el);

                    if (el.type === 'text') {
                        const textContent = el.content !== undefined && el.content !== null ? String(el.content) : 'Text';
                        // Use Textbox for correctly wrapping text and aligning it within the width
                        const text = new fabric.Textbox(textContent, {
                            ...options,
                            splitByGrapheme: true
                        });
                        fabricCanvas.add(text);
                    }
                    else if (el.type === 'shape') {
                        let shape: fabric.Object | null = null;

                        if (el.shapeType === 'rectangle') {
                            shape = new fabric.Rect(options);
                        } else if (el.shapeType === 'circle') {
                            const radius = options.width / 2;
                            shape = new fabric.Circle({ ...options, radius });
                        } else if (el.shapeType === 'triangle') {
                            shape = new fabric.Triangle(options);
                        } else if (el.shapeType === 'pointed-hexagon') {
                            const hexagonPoints = [
                                { x: -50, y: 0 },
                                { x: -25, y: -43.3 },
                                { x: 25, y: -43.3 },
                                { x: 50, y: 0 },
                                { x: 25, y: 43.3 },
                                { x: -25, y: 43.3 }
                            ];
                            shape = new fabric.Polygon(hexagonPoints, options);
                        } else {
                            shape = new fabric.Rect(options);
                        }

                        if (shape) {
                            fabricCanvas.add(shape);
                        }
                    }
                    else if (el.type === 'image') {
                        const p = new Promise<void>((resolve) => {
                            fabric.Image.fromURL(options.src, (img) => {
                                if (!img) {
                                    console.warn(`Failed to load image: ${options.src}`);
                                    resolve();
                                    return;
                                }
                                img.set({
                                    ...options,
                                    crossOrigin: 'anonymous'
                                });
                                fabricCanvas.add(img);
                                if (el.isBackground) {
                                    fabricCanvas.sendToBack(img);
                                }
                                resolve();
                            }, { crossOrigin: 'anonymous' });
                        });
                        imagePromises.push(p);
                    }
                } catch (err) {
                    console.error("Error creating element:", el, err);
                }
            });

            if (imagePromises.length > 0) {
                await Promise.all(imagePromises);
            }

            fabricCanvas.renderAll();
        }

        // 4. Wait for rendering (fonts/images)
        await document.fonts.ready;

        setTimeout(async () => {
            // 5. Auto-Save via API (Server Side)
            try {
                const dataURL = fabricCanvas.toDataURL({
                    format: 'png',
                    quality: 0.8,
                    multiplier: 0.5
                });

                const filename = template.thumbnail ? template.thumbnail.split('/').pop() : `${template.id}.png`;

                await fetch('/api/save-template-preview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dataUrl: dataURL, filename })
                });

                addLog(`Saved: ${filename}`);
            } catch (err) {
                addLog(`Error saving ${template.id}: ${err}`);
            }

            // 6. Next
            setCurrentIndex(prev => prev + 1);

        }, 1500);
    };

    return (
        <div style={{ padding: 20, background: '#f0f0f0', minHeight: '100vh' }}>
            <h1>Template Thumbnail Generator</h1>
            <div style={{ marginBottom: 20 }}>
                <button
                    onClick={startGeneration}
                    disabled={isGenerating}
                    style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: 5 }}
                >
                    {isGenerating ? 'Generating...' : 'Start Generation Template Images'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 400, height: 600, background: 'white', border: '1px solid #ccc', overflowY: 'scroll' }}>
                    <h3>Logs</h3>
                    {logs.map((log, i) => <div key={i} style={{ padding: '2px 5px', borderBottom: '1px solid #eee' }}>{log}</div>)}
                </div>

                <div style={{ flex: 1 }}>
                    <h3>Canvas Preview</h3>
                    <div style={{ border: '1px solid black', display: 'inline-block' }}>
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};
