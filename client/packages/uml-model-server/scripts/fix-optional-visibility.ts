/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import fs from 'fs';
import path from 'path';

/**
 * Post-generation fix for Langium bug: optional fields with union types are not
 * properly marked as optional in generated TypeScript interfaces.
 *
 * This script fixes the visibility field in Class and related interfaces that
 * should be optional but are generated as required.
 */

const astFilePath = path.join(process.cwd(), 'src/gen/langium/language/ast.ts');

const classesWithOptionalVisibility = ['Class', 'Operation', 'Parameter', 'Property'];

if (!fs.existsSync(astFilePath)) {
    console.error(`AST file not found: ${astFilePath}`);
    process.exit(1);
}

let content = fs.readFileSync(astFilePath, 'utf-8');

for (const className of classesWithOptionalVisibility) {
    // Match the interface definition and the visibility field
    // Find: visibility: Visibility (with proper whitespace handling)
    const regex = new RegExp(`(export interface ${className} extends.*?{[^}]*?)(\\s+visibility: Visibility)([^?])`, 's');

    if (regex.test(content)) {
        // Replace with optional marker
        content = content.replace(regex, `$1\n    visibility?: Visibility$3`);
        console.log(`✓ Fixed ${className}.visibility to be optional`);
    }
}

fs.writeFileSync(astFilePath, content, 'utf-8');
console.log('✓ AST file patched successfully');
