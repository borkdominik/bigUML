/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { Children, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import '../../../../styles/tooltip.css';

export interface BigTooltipProps {
    disabled?: boolean;
    children: ReactNode;
}

export function BigTooltip({ disabled, children }: BigTooltipProps): ReactElement {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    const slotAnchor = Children.toArray(children).find(child => {
        return isValidElement(child) && child.props['slot'] === 'anchor';
    });

    const slotText = Children.toArray(children).find(child => {
        return isValidElement(child) && child.props['slot'] === 'text';
    });

    useEffect(() => {
        const anchor = anchorRef.current;

        if (!anchor) return;

        const show = () => {
            if (!disabled) {
                setVisible(true);
                updateTooltip();
            }
        };

        const hide = () => {
            setVisible(false);
        };

        const events = [
            ['mouseenter', show],
            ['mouseleave', hide],
            ['focus', show],
            ['blur', hide]
        ] as const;

        events.forEach(([event, handler]) => anchor.addEventListener(event, handler));

        return () => {
            events.forEach(([event, handler]) => anchor.removeEventListener(event, handler));
        };
    }, [disabled]);

    useEffect(() => {
        if (visible) {
            updateTooltip();
        }
    }, [visible, anchorRef, tooltipRef, arrowRef]);

    const updateTooltip = () => {
        const anchor = anchorRef.current;
        const tooltip = tooltipRef.current;
        const arrowEl = arrowRef.current;

        if (!anchor || !tooltip || !arrowEl) return;

        computePosition(anchor, tooltip, {
            placement: 'bottom-start',
            middleware: [offset(12), flip(), shift({ padding: 5 }), arrow({ element: arrowEl })]
        }).then(({ placement, x, y, middlewareData }) => {
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;

            if (middlewareData.arrow) {
                const { x: arrowX, y: arrowY } = middlewareData.arrow;
                const sides: { [key: string]: string } = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
                const staticSide = sides[placement.split('-')[0]];

                Object.assign(arrowEl.style, {
                    left: arrowX != null ? `${arrowX}px` : '',
                    top: arrowY != null ? `${arrowY}px` : '',
                    right: '',
                    bottom: '',
                    [staticSide]: '-4px'
                });
            }
        });
    };

    if (slotAnchor === undefined || slotText === undefined) {
        return <>No slottable children provided for tooltip</>;
    }

    return (
        <div className='big-tooltip-container'>
            <div ref={anchorRef}>{slotAnchor}</div>
            {visible && (
                // eslint-disable-next-line react/no-unknown-property
                <div ref={tooltipRef} popup-show='' className='big-tooltip'>
                    <div ref={arrowRef} className='big-tooltip-arrow'></div>
                    {slotText}
                </div>
            )}
        </div>
    );
}
