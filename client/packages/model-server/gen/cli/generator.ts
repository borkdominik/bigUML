/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import fs from 'fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import path from 'path';
import { extractDestinationAndName } from './cli-util.js';

export function generateJavaScript(_model: any, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    fileNode.append('"use strict";', NL, NL);
    // model.nodes.forEach(node => fileNode.append(`console.log('Hello, ${node.name}!');`, NL));
    // model.edges.forEach(edge => fileNode.append(`console.log('Edge from ${edge.src.ref?.name} to ${edge.tgt.ref?.name}!');`, NL));

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));

    const testKarolFilePath = path.join(data.destination, 'testkarol.ts');
    fs.writeFileSync(testKarolFilePath, "console.log('Hello world');\n");

    return generatedFilePath;
}
