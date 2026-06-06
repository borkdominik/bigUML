/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

const WORD_BREAK = /([a-z0-9])([A-Z])/g;

/** Convert `"MyClassName"` to `"MY_CLASS_NAME"`. */
export const toConstant = (s: string): string => s.replace(WORD_BREAK, '$1_$2').toUpperCase();

/** Convert `"MyClassName"` to `"my-class-name"`. */
export const toKebab = (s: string): string => s.replace(WORD_BREAK, '$1-$2').toLowerCase();

/** Convert `"myProperty"` to `"My Property"`. */
export const toHuman = (s: string): string => s.replace(WORD_BREAK, '$1 $2').replace(/^\w/, c => c.toUpperCase());

/** Lowercase first character. */
export const lcFirst = (s: string): string => s.charAt(0).toLowerCase() + s.slice(1);
