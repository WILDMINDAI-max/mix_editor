import { NextResponse } from 'next/server';
import { Template } from '@/types/template';

// We manually assemble the two default templates requested
const templates: Template[] = [
    {
        info: {
            id: 'template-insta-midnight-sale',
            name: 'Midnight Sale Post',
            description: 'A striking dark-themed sale banner for Instagram',
            category: 'social-media',
            subcategory: 'instagram',
            tags: ['sale', 'promotion', 'midnight', 'dark'],
            thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400',
            isPremium: false,
            createdAt: Date.now()
        },
        defaultPalette: 0,
        defaultFontPairing: 0,
        customization: {
            colorPalettes: [],
            fontPairings: [],
            replacableImages: [],
            editableText: ['text-sale', 'text-subtitle']
        },
        pages: [
            {
                id: 'page-1',
                name: 'Instagram Post',
                width: 1080,
                height: 1080,
                dpi: 72,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                background: {
                    type: 'solid',
                    color: '#111111'
                },
                elements: [
                    // Background large Shape
                    {
                        id: 'shape-bg-decor',
                        type: 'shape',
                        name: 'Deco Shape',
                        shapeType: 'circle',
                        locked: false,
                        visible: true,
                        selectable: false,
                        zIndex: 1,
                        blendMode: 'normal',
                        transform: {
                            x: 540,
                            y: 540,
                            width: 800,
                            height: 800,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                            skewX: 0,
                            skewY: 0,
                            originX: 'center',
                            originY: 'center'
                        },
                        style: {
                            fill: '#FF0055',
                            stroke: null,
                            strokeWidth: 0,
                            opacity: 0.2,
                            shadow: null,
                            cornerRadius: 0
                        }
                    },
                    // "SALE" Text
                    {
                        id: 'text-sale',
                        type: 'text',
                        name: 'Title Text',
                        content: 'SALE',
                        editable: true,
                        locked: false,
                        visible: true,
                        selectable: true,
                        zIndex: 2,
                        blendMode: 'normal',
                        transform: {
                            x: 540,
                            y: 450,
                            width: 800,
                            height: 200,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                            skewX: 0,
                            skewY: 0,
                            originX: 'center',
                            originY: 'center'
                        },
                        style: {
                            fill: '#FFFFFF',
                            stroke: null,
                            strokeWidth: 0,
                            opacity: 1,
                            shadow: null,
                            cornerRadius: 0
                        },
                        textStyle: {
                            fontFamily: 'Inter',
                            fontSize: 200,
                            fontWeight: 'bold',
                            fontStyle: 'normal',
                            textDecoration: 'none',
                            textAlign: 'center',
                            lineHeight: 1,
                            letterSpacing: -2,
                            textTransform: 'uppercase'
                        },
                        effect: {
                            type: 'neon',
                            shapeType: 'none',
                            neonColor: '#FF0055',
                            neonIntensity: 50
                        }
                    },
                    // Subtitle
                    {
                        id: 'text-subtitle',
                        type: 'text',
                        name: 'Subtitle Box',
                        content: 'UP TO 50% OFF ENTIRE STORE',
                        editable: true,
                        locked: false,
                        visible: true,
                        selectable: true,
                        zIndex: 3,
                        blendMode: 'normal',
                        transform: {
                            x: 540,
                            y: 650,
                            width: 600,
                            height: 100,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                            skewX: 0,
                            skewY: 0,
                            originX: 'center',
                            originY: 'center'
                        },
                        style: {
                            fill: '#FFAA00',
                            stroke: null,
                            strokeWidth: 0,
                            opacity: 1,
                            shadow: null,
                            cornerRadius: 0
                        },
                        textStyle: {
                            fontFamily: 'Inter',
                            fontSize: 40,
                            fontWeight: 'normal',
                            fontStyle: 'normal',
                            textDecoration: 'none',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            letterSpacing: 2,
                            textTransform: 'uppercase'
                        },
                        effect: {
                            type: 'none',
                            shapeType: 'none'
                        }
                    }
                ]
            }
        ]
    },
    {
        info: {
            id: 'template-yt-pro-tutorial',
            name: 'Pro YouTube Thumbnail',
            description: 'An eye-catching, highly clickable tutorial thumbnail',
            category: 'social-media',
            subcategory: 'youtube',
            tags: ['youtube', 'thumbnail', 'tutorial', 'business'],
            thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400',
            isPremium: false,
            createdAt: Date.now()
        },
        defaultPalette: 0,
        defaultFontPairing: 0,
        customization: {
            colorPalettes: [],
            fontPairings: [],
            replacableImages: ['placeholder-image'],
            editableText: ['text-tutorial', 'text-subject']
        },
        pages: [
            {
                id: 'page-1',
                name: 'YouTube Thumbnail',
                width: 1280,
                height: 720,
                dpi: 72,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                background: {
                    type: 'solid',
                    color: '#FFCC00'
                },
                elements: [
                    // A huge rectangle block slicing through
                    {
                        id: 'shape-half-block',
                        type: 'shape',
                        name: 'Accent Block',
                        shapeType: 'square',
                        locked: false,
                        visible: true,
                        selectable: false,
                        zIndex: 1,
                        blendMode: 'normal',
                        transform: {
                            x: 320,
                            y: 360,
                            width: 640,
                            height: 800,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 8, // slight angle for dynamic feel
                            skewX: 0,
                            skewY: 0,
                            originX: 'center',
                            originY: 'center'
                        },
                        style: {
                            fill: '#151515',
                            stroke: null,
                            strokeWidth: 0,
                            opacity: 1,
                            shadow: null,
                            cornerRadius: 0
                        }
                    },
                    // "TUTORIAL" Label
                    {
                        id: 'text-tutorial',
                        type: 'text',
                        name: 'Subtitle',
                        content: 'FULL TUTORIAL',
                        editable: true,
                        locked: false,
                        visible: true,
                        selectable: true,
                        zIndex: 2,
                        blendMode: 'normal',
                        transform: {
                            x: 320,
                            y: 200,
                            width: 500,
                            height: 60,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                            skewX: 0,
                            skewY: 0,
                            originX: 'center',
                            originY: 'center'
                        },
                        style: {
                            fill: '#FFFFFF',
                            stroke: null,
                            strokeWidth: 0,
                            opacity: 1,
                            shadow: null,
                            cornerRadius: 0
                        },
                        textStyle: {
                            fontFamily: 'Inter',
                            fontSize: 48,
                            fontWeight: 'bold',
                            fontStyle: 'normal',
                            textDecoration: 'none',
                            textAlign: 'center',
                            lineHeight: 1,
                            letterSpacing: 0,
                            textTransform: 'uppercase'
                        },
                        effect: {
                            type: 'background',
                            shapeType: 'none',
                            backgroundColor: '#FF0055',
                            backgroundPadding: 16,
                            backgroundRadius: 8
                        }
                    },
                    // Subject Text
                    {
                        id: 'text-subject',
                        type: 'text',
                        name: 'Main Title',
                        content: 'HOW TO\nMAKE\nMONEY',
                        editable: true,
                        locked: false,
                        visible: true,
                        selectable: true,
                        zIndex: 3,
                        blendMode: 'normal',
                        transform: {
                            x: 320,
                            y: 420,
                            width: 500,
                            height: 300,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                            skewX: 0,
                            skewY: 0,
                            originX: 'center',
                            originY: 'center'
                        },
                        style: {
                            fill: '#FFFFFF',
                            stroke: null,
                            strokeWidth: 0,
                            opacity: 1,
                            shadow: null,
                            cornerRadius: 0
                        },
                        textStyle: {
                            fontFamily: 'Inter',
                            fontSize: 100,
                            fontWeight: 'bold',
                            fontStyle: 'normal',
                            textDecoration: 'none',
                            textAlign: 'center',
                            lineHeight: 1,
                            letterSpacing: -1,
                            textTransform: 'uppercase'
                        },
                        effect: {
                            type: 'lift',
                            shapeType: 'none',
                            liftDistance: 8,
                            liftBlur: 10
                        }
                    }
                ]
            }
        ]
    }
];

export async function GET() {
    return NextResponse.json({ templates });
}
