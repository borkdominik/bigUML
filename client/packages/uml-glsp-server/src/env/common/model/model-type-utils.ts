/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Builds a type ID in the format: `<representation>__<name>`.
 */
export function representationTypeId(representation: string, _type: string, name: string): string {
    return `${representation.toLowerCase()}__${name}`;
}

/**
 * Builds a type ID in the format: `<representation>__<template>__<name>`.
 */
export function representationTemplateTypeId(representation: string, _type: string, template: string, name: string): string {
    return `${representation.toLowerCase()}__${template}__${name}`;
}

/**
 * Utilities for converting element IDs to AST type names.
 */
export namespace AstTypeUtils {
    export function stripPrefix(name: string): string {
        return name.replace(/^.*?__/, '');
    }
}
