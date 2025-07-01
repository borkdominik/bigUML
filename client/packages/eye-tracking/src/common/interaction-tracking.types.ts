/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export interface InteractionEvent {
    timestamp: number;
    type: InteractionEventType;
    data: any;
    sessionId: string;
}

export enum InteractionEventType {
    // Mouse events
    MOUSE_CLICK = 'mouse_click',
    MOUSE_MOVE = 'mouse_move',
    MOUSE_DRAG = 'mouse_drag',
    
    // Keyboard events
    KEY_PRESS = 'key_press',
    SHORTCUT = 'shortcut',
    
    // Diagram interactions
    ELEMENT_SELECT = 'element_select',
    ELEMENT_CREATE = 'element_create',
    ELEMENT_DELETE = 'element_delete',
    ELEMENT_MOVE = 'element_move',
    ELEMENT_RESIZE = 'element_resize',
    ELEMENT_EDIT = 'element_edit',
    
    // Editor interactions
    TEXT_EDIT = 'text_edit',
    FILE_OPEN = 'file_open',
    FILE_SAVE = 'file_save',
    FILE_CLOSE = 'file_close',
    
    // View changes
    VIEWPORT_CHANGE = 'viewport_change',
    ZOOM_CHANGE = 'zoom_change',
    SCROLL = 'scroll',
    
    // Tool palette
    TOOL_SELECT = 'tool_select',
    PALETTE_OPEN = 'palette_open',
    
    // Property palette
    PROPERTY_CHANGE = 'property_change',
    
    // Session events
    SESSION_START = 'session_start',
    SESSION_END = 'session_end',
    SESSION_PAUSE = 'session_pause',
    SESSION_RESUME = 'session_resume',
    
    // Eye tracking
    EYE_TRACKING_START = 'eye_tracking_start',
    EYE_TRACKING_STOP = 'eye_tracking_stop',
    EYE_TRACKING_CALIBRATE = 'eye_tracking_calibrate'
}

export interface MouseInteractionData {
    x: number;
    y: number;
    button?: 'left' | 'right' | 'middle';
    elementId?: string;
    elementType?: string;
}

export interface KeyboardInteractionData {
    key: string;
    modifiers: {
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        meta: boolean;
    };
}

export interface ElementInteractionData {
    elementId: string;
    elementType: string;
    containerId?: string;
    properties?: any;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
}

export interface ViewportInteractionData {
    scroll: { x: number; y: number };
    zoom: number;
    canvasBounds?: { x: number; y: number; width: number; height: number };
}

export interface FileInteractionData {
    filePath: string;
    fileName: string;
    language?: string;
}

export interface SessionData {
    sessionId: string;
    startTime: number;
    endTime?: number;
    
    // Tool identification (generic GLSP support)
    toolId: string;  // e.g., "bigUML", "bpmn-glsp"
    toolVersion?: string;
    
    // Editor/Model information (generic names)
    editorType?: string;  // e.g., "activity", "class", "bpmn"
    modelFile?: string;  // Filename
    modelFilePath?: string;  // Full path
    
    // User TODO check if we should probably hash this
    user?: string;
    workspace?: string;
    totalEvents?: number;
    
    // Legacy field names (for backward compatibility - still populated)
    umlFile?: string;  // Same as modelFile
    umlFilePath?: string;  // Same as modelFilePath
    diagramType?: string;  // Same as editorType
}
