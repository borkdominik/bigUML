/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/


declare module 'webgazer' {
    interface GazeData {
        x: number;
        y: number;
        eyeFeatures?: any;
    }

    interface WebGazerParams {
        showVideo(show: boolean): WebGazerParams;
        showPredictions(show: boolean): WebGazerParams;
        showFaceOverlay(show: boolean): WebGazerParams;
        showFaceFeedbackBox(show: boolean): WebGazerParams;
        storingPoints(storing: boolean): WebGazerParams;
    }

    interface WebGazer {
        /**
         * Sets the regression model to use for gaze prediction
         * @param regression The regression model ('ridge', 'weightedRidge', 'threadedRidge', 'linear')
         */
        setRegression(regression: string): WebGazer;

        /**
         * Sets the tracker to use for face detection
         * @param tracker The tracker ('clmtrackr', 'js_objectdetect', 'TFFacemesh')
         */
        setTracker(tracker: string): WebGazer;

        /**
         * Sets the gaze listener callback
         * @param listener Function called with gaze data
         */
        setGazeListener(listener: (data: GazeData | null) => void): WebGazer;

        /**
         * Begin eye tracking
         */
        begin(): Promise<void>;

        /**
         * End eye tracking
         */
        end(): Promise<void>;

        /**
         * Check if WebGazer is ready
         */
        isReady(): boolean;

        /**
         * Pause tracking
         */
        pause(): WebGazer;

        /**
         * Resume tracking
         */
        resume(): WebGazer;

        /**
         * Clear all stored data
         */
        clearData(): WebGazer;

        /**
         * Record screen position for calibration
         * @param x X coordinate
         * @param y Y coordinate 
         * @param eventType Type of event ('click', 'move')
         */
        recordScreenPosition(x: number, y: number, eventType: string): void;

        /**
         * Get current gaze prediction
         */
        getCurrentPrediction(): GazeData | null;

        /**
         * Parameters for configuration
         */
        params: WebGazerParams;

        /**
         * Get regression data
         */
        getRegression(): any;

        /**
         * Get tracker
         */
        getTracker(): any;

        /**
         * Set video element
         */
        setVideoElement(video: HTMLVideoElement): WebGazer;

        /**
         * Set canvas element
         */
        setCanvas(canvas: HTMLCanvasElement): WebGazer;

        /**
         * Show video preview
         */
        showPredictionPoints(show: boolean): WebGazer;

        /**
         * Apply kalman filter
         */
        applyKalmanFilter(apply: boolean): WebGazer;
    }

    const webgazer: WebGazer;
    export default webgazer;
}