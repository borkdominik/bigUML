/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import endent from 'endent';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

const settings = {
    input: './resources/papyrus/**/*',
    output: {
        folder: './css/papyrus',
        variablesFile: 'variables.css',
        classesFile: 'classes.css'
    }
} as const;

function createCSSIcon(className: string, iconVar: string): string {
    return endent`.${className} {
            background-image: var(${iconVar});
        }`;
}

function createCSSVar(varName: string, filePath: string): string {
    const relativePath = path.relative(settings.output.folder, filePath);
    return `${varName}: url("${relativePath}");`;
}

console.log('Active settings', settings);
console.log('');

glob(settings.input, (err, res) => {
    console.log('Start Processing.');

    if (err) {
        console.error('Error', err);
        return;
    }

    const variables: string[] = [];
    const classes: string[] = [];
    const files = res.filter(r => fs.lstatSync(r).isFile()).sort();
    console.log(`Detected ${res.length - files.length} folders and ${files.length} files.`);

    const uniqueMap: { [key: string]: string } = {};

    files.forEach(filePath => {
        const file = filePath.split(/[/]+/).pop()!;
        const fileName = file.split('.')[0];

        if (uniqueMap[fileName] === undefined) {
            uniqueMap[fileName] = filePath;
        } else {
            console.warn('[Duplicate] Ignored:', filePath);
        }
    });

    let progress = 0;
    const uniqueFiles = Object.values(uniqueMap);

    if (uniqueFiles.length !== files.length) {
        console.log();
        console.log(`\t => Unique files: ${uniqueFiles.length}`);
    }

    console.log();
    uniqueFiles.forEach(filePath => {
        const file = filePath.split(/[/]+/).pop()!;
        const fileName = file.split('.')[0];
        const className = `uml-${fileName
            .replace(/_/g, '-')
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase()}-icon`;
        const varName = `--${className}`;

        variables.push(createCSSVar(varName, filePath));
        classes.push(createCSSIcon(className, varName));
        progress++;

        if (progress % 10 === 0) {
            console.log(`[${progress}/${uniqueFiles.length}] Files processed...`);
        }
    });

    console.log();

    fs.mkdirSync(settings.output.folder, { recursive: true });

    const variablesData = endent`/* THIS FILE IS GENERATED */

        :root {
            ${variables.join('\n')}
        }
    `;

    const classesData = endent`/* THIS FILE IS GENERATED */
    
        ${classes.join('\n')}
    `;

    const variablesFile = fullPath(settings.output, 'variablesFile');
    fs.writeFileSync(variablesFile, variablesData);
    console.log(`File ${variablesFile} created.`);

    const classesFile = fullPath(settings.output, 'classesFile');
    fs.writeFileSync(`${settings.output.folder}/${settings.output.classesFile}`, classesData);
    console.log(`File ${classesFile} created.`);

    console.log('Finished.');
});

function fullPath(output: (typeof settings)['output'], property: keyof Pick<typeof output, 'classesFile' | 'variablesFile'>): string {
    return `${output.folder}/${output[property]}`;
}
