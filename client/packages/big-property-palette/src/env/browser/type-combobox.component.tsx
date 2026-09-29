/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { classNames } from '@borkdominik-biguml/big-components';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react';

/** The tallest the list is drawn, where the window has the room. */
const MAX_LIST_HEIGHT = 200;
/** Kept clear between the list and the edge of the window. */
const WINDOW_MARGIN = 8;

export interface TypeComboboxProps {
    /** The type as it is stored - a type of the model by its name, or a name typed in. */
    value: string;
    /** The types of the model offered to pick from. */
    suggestions: readonly string[];
    /** Called with the type chosen; the empty value takes the type off. */
    onCommit: (value: string) => void;
    title?: string;
    className?: string;
}

/**
 * The type of a property or a parameter: one of the types of the model, or any name typed in.
 *
 * Typing narrows the types down, and what is typed is the type:
 * - a name one of the types already has, in whatever case, is that type;
 * - a type clicked in the list, or picked with the arrow keys and `Enter`, is taken there and then;
 * - any other name is taken as it is typed, on `Enter` or when the field is left - there is nothing to
 *   add first. An empty field takes the type off.
 * Whether the name is stored as a reference to the type or as text is decided on the server (see
 * `TypedElementExtension`).
 *
 * Built on a plain `<input>` rather than the web component selects and fields of the palette: those keep
 * their input in a shadow root and their state to themselves, so neither what is being typed nor leaving
 * the field can be relied on from outside - and both are what this field is made of.
 */
export function TypeCombobox(props: TypeComboboxProps): ReactElement {
    const input = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(-1);
    const [placement, setPlacement] = useState<CSSProperties>({});
    /** Set once this edit is committed, so that leaving the field afterwards does not commit it again. */
    const committed = useRef(false);

    // The stored value is written into the field when it changes, and at no other time: the field is
    // what is being typed until then.
    useEffect(() => {
        if (input.current && document.activeElement !== input.current) {
            input.current.value = props.value;
        }
    }, [props.value]);

    // Placed against the window, so that the palette's scrolling body does not cut the list off, and
    // placed again whenever the page moves under it.
    useLayoutEffect(() => {
        if (!open) {
            return undefined;
        }
        const place = (): void => {
            if (input.current) {
                setPlacement(listPlacement(input.current));
            }
        };
        place();
        window.addEventListener('scroll', place, true);
        window.addEventListener('resize', place);
        return () => {
            window.removeEventListener('scroll', place, true);
            window.removeEventListener('resize', place);
        };
    }, [open]);

    const matches = props.suggestions.filter(suggestion => suggestion.toLowerCase().includes(query.trim().toLowerCase()));

    /** The type a typed name stands for: the type called that, whatever the case, else the name itself. */
    const resolve = (text: string): string => {
        const name = text.trim();
        return props.suggestions.find(suggestion => suggestion.toLowerCase() === name.toLowerCase()) ?? name;
    };

    const commit = (value: string): void => {
        committed.current = true;
        setOpen(false);
        setActive(-1);
        if (input.current) {
            input.current.value = value;
        }
        if (value !== props.value) {
            props.onCommit(value);
        }
    };

    return (
        <div className={classNames('type-combobox', props.className)}>
            <input
                ref={input}
                className='type-combobox-input'
                defaultValue={props.value}
                title={props.title}
                placeholder={props.title}
                spellCheck={false}
                autoComplete='off'
                role='combobox'
                aria-expanded={open}
                onFocus={() => {
                    committed.current = false;
                    // Everything on offer when the field is entered, narrowed down as it is typed in.
                    setQuery('');
                    setActive(-1);
                    setOpen(true);
                }}
                onInput={e => {
                    committed.current = false;
                    setQuery(e.currentTarget.value);
                    setActive(-1);
                    setOpen(true);
                }}
                onKeyDown={e => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (!open) {
                            setOpen(true);
                            return;
                        }
                        if (matches.length > 0) {
                            const step = e.key === 'ArrowDown' ? 1 : -1;
                            setActive(index => (index + step + matches.length) % matches.length);
                        }
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        commit(open && active >= 0 && active < matches.length ? matches[active] : resolve(e.currentTarget.value));
                    } else if (e.key === 'Escape') {
                        // Back to what is stored, and nothing committed.
                        e.currentTarget.value = props.value;
                        committed.current = true;
                        setOpen(false);
                    }
                }}
                onBlur={e => {
                    setOpen(false);
                    if (!committed.current) {
                        commit(resolve(e.currentTarget.value));
                    }
                }}
            />
            {open && matches.length > 0 ? (
                <ul className='type-combobox-list' role='listbox' style={placement}>
                    {matches.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            role='option'
                            aria-selected={suggestion === props.value}
                            className={classNames({ active: index === active, selected: suggestion === props.value })}
                            onMouseEnter={() => setActive(index)}
                            // `mousedown` rather than `click`, and the default prevented: the field keeps the
                            // focus, so it is not left - and nothing typed committed - before the pick lands.
                            onMouseDown={e => {
                                e.preventDefault();
                                commit(suggestion);
                            }}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

/** Under the field, or over it where the window has more room above. */
function listPlacement(field: HTMLElement): CSSProperties {
    const bounds = field.getBoundingClientRect();
    const below = window.innerHeight - bounds.bottom - WINDOW_MARGIN;
    const above = bounds.top - WINDOW_MARGIN;
    const opensAbove = below < MAX_LIST_HEIGHT && above > below;
    return {
        left: bounds.left,
        width: bounds.width,
        maxHeight: Math.max(0, Math.min(MAX_LIST_HEIGHT, opensAbove ? above : below)),
        ...(opensAbove ? { bottom: window.innerHeight - bounds.top + 2 } : { top: bounds.bottom + 2 })
    };
}
