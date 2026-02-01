/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { VSCodeButton } from '@vscode/webview-ui-toolkit/react/index.js';
import { Children, isValidElement, useCallback, useRef, useState, type ReactNode } from 'react';
import { BigTooltip } from '../tooltip/tooltip.component.js';
import { ContextMenu, ContextMenuItem } from './context-menu.component.js';

export interface BigMenuProps {
    children: ReactNode;
}

export function BigMenu({ children }: BigMenuProps) {
    const menuButtonRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const slotMenuTrigger = Children.toArray(children).find(child => {
        return isValidElement(child) && child.props['slot'] === 'menu-trigger';
    });

    const show = useCallback(() => {
        setIsOpen(true);
    }, []);

    const hide = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        if (isOpen) {
            hide();
        } else {
            show();
        }
    }, [hide, isOpen, show]);

    const renderSlotMenuTrigger = useCallback(() => {
        if (slotMenuTrigger) {
            return slotMenuTrigger;
        }

        return (
            <slot name='menu-trigger'>
                <VSCodeButton appearance='icon'>
                    <div className='codicon codicon-ellipsis'></div>
                </VSCodeButton>
            </slot>
        );
    }, [slotMenuTrigger]);

    return (
        <>
            <BigTooltip disabled={isOpen}>
                <div slot='anchor' id='menu-button' ref={menuButtonRef} onClick={toggle}>
                    {renderSlotMenuTrigger()}
                </div>
                <span slot='text'>More actions...</span>
            </BigTooltip>
            <ContextMenu anchorRef={menuButtonRef} isOpen={isOpen} onOpen={() => setIsOpen(true)} onHide={() => setIsOpen(false)}>
                <div id='menu-items'>{children}</div>
            </ContextMenu>
        </>
    );
}

export interface BigMenuItemProps {
    icon?: string;
    children: ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export function BigMenuItem({ icon, children, onClick }: BigMenuItemProps) {
    return (
        <ContextMenuItem icon={icon} onClick={onClick}>
            {children}
        </ContextMenuItem>
    );
}
