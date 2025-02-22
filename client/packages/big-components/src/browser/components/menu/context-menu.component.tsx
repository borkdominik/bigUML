/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import '../../../../styles/context-menu.css';

export interface ContextMenuProps {
    anchorRef: RefObject<HTMLElement>;
    children: ReactNode;
    isOpen?: boolean;

    onOpen?: () => void;
    onHide?: () => void;
}

/**
 * Context menu component
 * Allows to create a context menu that can be anchored to an element
 * with auto positioning
 */
export function ContextMenu(props: ContextMenuProps): React.ReactElement {
    const [isVisible, setIsVisible] = useState(false);
    /**
     * Reference to the context menu element itself
     */
    const contextMenuRef = useRef<HTMLDivElement | null>(null);
    const disposables = useRef<(() => void)[]>([]);

    const updateContextMenu = useCallback(() => {
        if (!props.anchorRef.current || !contextMenuRef.current) return;

        computePosition(props.anchorRef.current, contextMenuRef.current, {
            placement: 'bottom-start',
            middleware: [flip(), shift()]
        }).then(({ x, y }) => {
            if (contextMenuRef.current) {
                Object.assign(contextMenuRef.current.style, {
                    left: `${x}px`,
                    top: `${y}px`
                });
            }
        });
    }, [props.anchorRef]);

    useEffect(() => {
        if (props.isOpen && !isVisible) {
            setIsVisible(true);
            props.onOpen?.();
        } else if (!props.isOpen && isVisible) {
            setIsVisible(false);
            props.onHide?.();
        }
    }, [props, isVisible]);

    useEffect(() => {
        if (isVisible) {
            if (!props.anchorRef.current || !contextMenuRef.current) {
                return;
            }
            updateContextMenu();
            disposables.current.push(autoUpdate(props.anchorRef.current, contextMenuRef.current, updateContextMenu));
        } else if (!isVisible) {
            disposables.current.forEach(cb => cb());
            disposables.current = [];
        }
    }, [props.anchorRef, isVisible, updateContextMenu, contextMenuRef]);

    const handleDocumentClick = useCallback(
        (event: MouseEvent) => {
            const target = event.composedPath()[0] as HTMLElement;
            if (!target) return;

            if (
                event
                    .composedPath()
                    .filter(p => p instanceof HTMLElement)
                    .slice(1)
                    .some(p => p === props.anchorRef.current)
            ) {
                event.preventDefault();
            } else {
                props.onHide?.();
            }
        },
        [props]
    );

    const handleWindowBlur = useCallback(() => {
        props.onHide?.();
    }, [props]);

    useEffect(() => {
        if (props.anchorRef) {
            updateContextMenu();
        }
    }, [props.anchorRef, updateContextMenu]);

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [handleDocumentClick, handleWindowBlur]);

    return isVisible ? (
        // eslint-disable-next-line react/no-unknown-property
        <div className='big-context-menu' popup-show='' ref={contextMenuRef} onBlur={() => setIsVisible(false)}>
            <div className='big-context-menu-bar'>
                <div className='big-context-menu-actions'>{props.children}</div>
            </div>
        </div>
    ) : (
        <></>
    );
}

export interface ContextMenuItemProps {
    icon?: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function ContextMenuItem({ icon, children, onClick }: ContextMenuItemProps): React.ReactElement {
    return (
        <div className='big-context-menu-action' onClick={onClick}>
            {icon && <span className={`codicon ${icon} big-context-menu-action-icon`}></span>}
            <span className='big-context-menu-action-label'>{children}</span>
        </div>
    );
}
