/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type ReactElement } from 'react';

export interface SearchResultThumbnailProps {
    svg?: string;
    bounds?: { x: number; y: number; width: number; height: number };
    loading?: boolean;
}

export function SearchResultThumbnail({ svg, bounds, loading }: SearchResultThumbnailProps): ReactElement {
    if (svg && bounds) {
        const padding = 10;
        const viewBox = `${bounds.x - padding} ${bounds.y - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`;

        return (
            <div className='result-item__thumbnail-container'>
                <svg
                    className='result-item__thumbnail result-item__thumbnail--dynamic'
                    viewBox={viewBox}
                >
                    <g dangerouslySetInnerHTML={{ __html: svg }} />
                </svg>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='result-item__thumbnail-container result-item__thumbnail-container--loading'>
                <div className='result-item__thumbnail-shimmer' />
            </div>
        );
    }

    return (
        <div className='result-item__thumbnail-container result-item__thumbnail-container--empty'>
            <span className='codicon codicon-circle-slash' />
            <span className='result-item__thumbnail-empty-text'>No preview</span>
        </div>
    );
}