/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import * as fs from 'fs/promises';
import * as path from 'path';
import type { Diagram } from '../vscode/intermediate-model.js';
import { JavaUtils } from '../vscode/java/JavaUtils.js';

const mockVscodeUri = {
  file: (fsPath: string) => ({ fsPath })
};

describe('Code-to-Class Diagram Unit Tests', () => {
  let javaUtils: JavaUtils;
  const mockDirPath = path.resolve(__dirname, '../mock/java');

  beforeAll(async () => {
    javaUtils = new JavaUtils();
    const extensionUri = mockVscodeUri.file(path.resolve(__dirname, '../../../../application/vscode'));
    await javaUtils.doInit(extensionUri);
  });

  async function generateDiagram(javaFiles: string[]): Promise<Diagram> {
    const fileMap = new Map();
    for (const fileName of javaFiles) {
      const filePath = path.join(mockDirPath, fileName);
      const content = await fs.readFile(filePath, 'utf-8');
      const tree = javaUtils['parser']?.parse(content);
      if (tree) {
        const className = fileName.replace('.java', '');
        fileMap.set(className, tree);
      }
    }
    const nodes = await Promise.all(
      Array.from(fileMap.entries()).map(([key, value]) => javaUtils.createNode(key, value))
    );
    const nodeNameToIdMap = new Map<string, string>();
    for (const node of nodes) {
      nodeNameToIdMap.set(node.name, node.id);
    }
    const edgesArrays = await Promise.all(
      nodes.map(node => {
        const tree = fileMap.get(node.name);
        return tree ? javaUtils.createEdges(node, tree, nodeNameToIdMap) : Promise.resolve([]);
      })
    );
    const edges = edgesArrays.flat();
    return { nodes, edges };
  }

  function findEdge(diagram: Diagram, fromClass: string, toClass: string, edgeType?: string) {
    return diagram.edges.find(edge => {
      const fromNode = diagram.nodes.find(n => n.id === edge.fromId);
      const toNode = diagram.nodes.find(n => n.id === edge.toId);
      const typeMatch = edgeType ? edge.type === edgeType : true;
      return fromNode?.name === fromClass && toNode?.name === toClass && typeMatch;
    });
  }

  // Inheritance
  it('should detect inheritance', async () => {
    const diagram = await generateDiagram(['Device.java', 'Light.java', 'TemperatureSensor.java']);
    const edge1 = findEdge(diagram, 'Light', 'Device', 'Generalization');
    const edge2 = findEdge(diagram, 'TemperatureSensor', 'Device', 'Generalization');
    expect(edge1).toBeDefined();
    expect(edge2).toBeDefined();
  });

  // Realization
  it('should detect realization', async () => {
    const diagram = await generateDiagram(['IControllable.java', 'Light.java']);
    const edge = findEdge(diagram, 'Light', 'IControllable', 'Realization');
    expect(edge).toBeDefined();
  });

  // Multiple Realization
  it('should detect multiple interface realization', async () => {
    const diagram = await generateDiagram(['IControllable.java', 'ISensor.java', 'TemperatureSensor.java']);
    const edge1 = findEdge(diagram, 'TemperatureSensor', 'IControllable', 'Realization');
    const edge2 = findEdge(diagram, 'TemperatureSensor', 'ISensor', 'Realization');
    expect(edge1).toBeDefined();
    expect(edge2).toBeDefined();
  });

  // Aggregation of non-collection
  it('should detect aggregation of non-collection', async () => {
    const diagram = await generateDiagram(['RemoteControl.java', 'Device.java']);
    const edge = findEdge(diagram, 'RemoteControl', 'Device', 'Aggregation');
    expect(edge).toBeDefined();
  });

  // Aggregation of collection
  it('should detect aggregation of collection', async () => {
    const diagram = await generateDiagram(['SmartHomeController.java', 'Device.java', 'Light.java', 'TemperatureSensor.java', 'Room.java']);
    const edge1 = findEdge(diagram, 'SmartHomeController', 'Device', 'Aggregation');
    const edge2 = findEdge(diagram, 'Room', 'Light', 'Aggregation');
    const edge3 = findEdge(diagram, 'Room', 'TemperatureSensor', 'Aggregation');
    const edge4 = findEdge(diagram, 'SmartHomeController', 'Room', 'Aggregation');
    expect(edge1).toBeDefined();
    expect(edge2).toBeDefined();
    expect(edge3).toBeDefined();
    expect(edge4).toBeDefined();
  });

  // Composition of non-collection
  it('should detect composition', async () => {
    const diagram = await generateDiagram(['House.java', 'Room.java']);
    const edge = findEdge(diagram, 'House', 'Room', 'Composition');
    expect(edge).toBeDefined();
  });

  // Composition of collection
  it('should detect composition of collection', async () => {
    const diagram = await generateDiagram(['Building.java', 'Room.java']);
    const edge = findEdge(diagram, 'Building', 'Room', 'Composition');
    expect(edge).toBeDefined();
  });
}); 