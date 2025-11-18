/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup-tests.ts'],
        include: ['src/test/**/*.spec.ts', 'src/test/**/*.spec.tsx'],
        css: true,
        globals: true
    },
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react'
    }
});
