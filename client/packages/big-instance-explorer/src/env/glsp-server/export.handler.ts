/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { isClass, isDataType, isInstanceLink, isInstanceSpecification, isInterface } from '@borkdominik-biguml/uml-model-server/grammar';
import { type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { Eta } from 'eta';
import { inject, injectable } from 'inversify';
import { AstUtils } from 'langium';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, extname, join } from 'node:path';
import {
    AvailableExportTemplatesResponse,
    ExportInstancesResponse,
    RequestAvailableExportTemplatesAction,
    RequestExportInstancesAction,
    type ExportScope,
    type ExportTemplateSummary
} from '../common/index.js';

interface ExportInstance {
    id: string;
    name: string;
    classifierName: string;
    classifierId?: string;
    slots: { featureName: string; value: string; values: string[] }[];
}

interface ExportClassifier {
    id: string;
    name: string;
}

interface ExportLink {
    id: string;
    relationName?: string;
    sourceInstanceId?: string;
    targetInstanceId?: string;
}

interface ExportContext {
    instances: ExportInstance[];
    classifiers: ExportClassifier[];
    links: ExportLink[];
    diagramName: string;
    timestamp: string;
}

@injectable()
export class ExportInstancesActionHandler implements ActionHandler {
    actionKinds = [RequestExportInstancesAction.KIND, RequestAvailableExportTemplatesAction.KIND];

    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    execute(action: RequestExportInstancesAction | RequestAvailableExportTemplatesAction): MaybePromise<any[]> {
        if (RequestAvailableExportTemplatesAction.is(action)) {
            return [
                AvailableExportTemplatesResponse.create({
                    responseId: action.requestId,
                    templates: this.listAvailableTemplates(action.workspaceTemplateDirectory),
                    workspaceTemplateDirectory: action.workspaceTemplateDirectory ?? null
                })
            ];
        }

        try {
            const scope: ExportScope = action.action.scope;
            const classifiers = this.collectClassifiers();
            const allInstances = this.collectInstances();
            const requestedClassifierIds = new Set(action.action.classifierIds ?? []);

            if (action.action.classifierId) {
                requestedClassifierIds.add(action.action.classifierId);
            }

            let selectedInstances = allInstances;
            if (scope === 'byClassifier' && requestedClassifierIds.size > 0) {
                selectedInstances = allInstances.filter(
                    instance => instance.classifierId && requestedClassifierIds.has(instance.classifierId)
                );
            } else if (scope === 'selection' && Array.isArray(action.action.selection) && action.action.selection.length > 0) {
                const selectedIds = new Set(action.action.selection);
                selectedInstances = allInstances.filter(instance => selectedIds.has(instance.id));
            }

            const selectedInstanceIds = new Set(selectedInstances.map(instance => instance.id));
            const templateName = action.action.templateName || 'unknown';
            let context: ExportContext = {
                instances: selectedInstances.map(instance => ({
                    id: instance.id,
                    name: instance.name,
                    classifierName: instance.classifierName,
                    classifierId: instance.classifierId,
                    slots: instance.slots.map(slot => ({
                        featureName: slot.featureName,
                        value: slot.value,
                        values: [...slot.values]
                    }))
                })),
                classifiers: Array.from(classifiers.values()).map(entry => ({
                    id: entry.classifier.__id,
                    name: entry.classifier.name
                })),
                links: this.collectLinks(selectedInstanceIds),
                diagramName: this.resolveDiagramName(),
                timestamp: new Date().toISOString()
            };

            if (!action.action.customTemplateFile) {
                context = this.escapeContextForFormat(context, templateName);
            }

            const templatePath = this.resolveTemplatePath(templateName, action.action.customTemplateFile);
            const templateString = readFileSync(templatePath, { encoding: 'utf8' });
            const rendered = new Eta({ autoEscape: false }).renderString(templateString, context) ?? '';

            return [ExportInstancesResponse.create({ success: true, content: rendered })];
        } catch (error: any) {
            return [ExportInstancesResponse.create({ success: false, message: error?.message ?? String(error) })];
        }
    }

    protected collectClassifiers() {
        const byId = new Map<string, any>();
        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (isClass(node) || isInterface(node) || isDataType(node)) {
                byId.set(node.__id, { classifier: node });
            }
        }
        return byId;
    }

    protected collectInstances(): ExportInstance[] {
        const result: ExportInstance[] = [];
        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isInstanceSpecification(node)) {
                continue;
            }

            const instance = node;
            const classifierRef = instance.classifier?.ref as any;
            result.push({
                id: instance.__id,
                name: instance.name,
                classifierId: classifierRef?.__id,
                classifierName: classifierRef?.name ?? classifierRef?.$refText ?? '',
                slots: (instance.slots ?? []).map(slot => {
                    const values = (slot.values ?? []).map(value => value.value ?? value.name ?? '');
                    return {
                        featureName: slot.name ?? '',
                        value: values.join(','),
                        values
                    };
                })
            });
        }
        return result;
    }

    protected collectLinks(selectedInstanceIds: Set<string>): ExportLink[] {
        const links: ExportLink[] = [];
        for (const node of AstUtils.streamAst(this.modelState.semanticRoot)) {
            if (!isInstanceLink(node)) {
                continue;
            }

            const sourceInstanceId = node.source?.ref?.__id;
            const targetInstanceId = node.target?.ref?.__id;
            if (!sourceInstanceId || !targetInstanceId) {
                continue;
            }

            if (
                selectedInstanceIds.size > 0 &&
                (!selectedInstanceIds.has(sourceInstanceId) || !selectedInstanceIds.has(targetInstanceId))
            ) {
                continue;
            }

            links.push({
                id: node.__id,
                relationName: node.name,
                sourceInstanceId,
                targetInstanceId
            });
        }
        return links;
    }

    protected resolveDiagramName(): string {
        const namedDiagram = (this.modelState.semanticRoot as any)?.name;
        if (typeof namedDiagram === 'string' && namedDiagram.trim().length > 0) {
            return namedDiagram;
        }

        return this.modelState.semanticUri ? basename(this.modelState.semanticUri) : 'diagram';
    }

    protected resolveTemplatePath(templateName: string, customTemplateFile?: string | null): string {
        if (customTemplateFile) {
            return customTemplateFile;
        }

        const fileName = `${templateName}.eta`;
        const templateDirectory = this.resolvePackageTemplateDirectory();
        const templatePath = templateDirectory ? join(templateDirectory, fileName) : null;
        if (!templatePath) {
            throw new Error(`Template "${templateName}" could not be found.`);
        }
        if (!existsSync(templatePath)) {
            throw new Error(`Template "${templateName}" could not be found.`);
        }

        return templatePath;
    }

    protected listAvailableTemplates(workspaceTemplateDirectory?: string | null): ExportTemplateSummary[] {
        const templates = new Map<string, ExportTemplateSummary>();

        const builtinTemplateDirectory = this.resolvePackageTemplateDirectory();
        if (builtinTemplateDirectory) {
            for (const template of this.readTemplatesFromDirectory(
                builtinTemplateDirectory,
                'builtin',
                `Template from ${join('packages', 'big-instance-explorer', 'templates')}`
            )) {
                templates.set(template.name, template);
            }
        }

        if (workspaceTemplateDirectory && existsSync(workspaceTemplateDirectory)) {
            for (const template of this.readTemplatesFromDirectory(
                workspaceTemplateDirectory,
                'workspace',
                `Template from ${join('.biguml', 'templates')}`
            )) {
                templates.set(template.name, template);
            }
        }

        return Array.from(templates.values()).sort((left, right) => left.label.localeCompare(right.label));
    }

    protected readTemplatesFromDirectory(
        directory: string,
        kind: ExportTemplateSummary['kind'],
        descriptionPrefix: string
    ): ExportTemplateSummary[] {
        try {
            const entries = readdirSync(directory, { withFileTypes: true });
            return entries
                .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.eta'))
                .map(entry => ({
                    name: basename(entry.name, '.eta'),
                    label: basename(entry.name, '.eta'),
                    kind,
                    extension: this.inferExtensionFromTemplate(entry.name, kind),
                    description: `${descriptionPrefix}/${entry.name}.`,
                    file: join(directory, entry.name)
                }));
        } catch {
            return [];
        }
    }

    protected resolvePackageTemplateDirectory(): string | null {
        const bundledTemplatePathCandidates = [
            join(dirname(__filename), 'templates', 'instance-export'),
            join(dirname(__filename), '..', 'templates', 'instance-export')
        ];
        for (const bundledTemplateDirectory of bundledTemplatePathCandidates) {
            if (existsSync(bundledTemplateDirectory)) {
                return bundledTemplateDirectory;
            }
        }

        try {
            const require = createRequire(__filename);
            const packageEntry = require.resolve('@borkdominik-biguml/big-instance-explorer');

            let currentDir = dirname(packageEntry);
            for (let i = 0; i < 6; i++) {
                const templateDirectory = join(currentDir, 'templates');
                if (existsSync(templateDirectory)) {
                    return templateDirectory;
                }

                const parentDir = dirname(currentDir);
                if (parentDir === currentDir) {
                    break;
                }

                currentDir = parentDir;
            }

            return null;
        } catch {
            return null;
        }
    }

    protected inferExtensionFromTemplate(templateFileName: string, kind: ExportTemplateSummary['kind']): string {
        const withoutEta = basename(templateFileName, '.eta');
        const nestedExtension = extname(withoutEta);
        if (nestedExtension) {
            return nestedExtension.slice(1);
        }

        if (kind === 'builtin') {
            return withoutEta;
        }

        return 'txt';
    }

    protected escapeContextForFormat(context: ExportContext, format: string): ExportContext {
        switch (format) {
            case 'json':
                return this.escapeContextForJson(context);
            case 'csv':
                return this.escapeContextForCsv(context);
            case 'xml':
                return this.escapeContextForXml(context);
            default:
                return context;
        }
    }

    protected escapeContextForJson(context: ExportContext): ExportContext {
        return {
            ...context,
            instances: context.instances.map(inst => ({
                ...inst,
                name: this.escapeJson(inst.name),
                classifierName: this.escapeJson(inst.classifierName),
                slots: inst.slots.map(slot => ({
                    ...slot,
                    featureName: this.escapeJson(slot.featureName),
                    value: this.escapeJson(slot.value),
                    values: slot.values.map(v => this.escapeJson(v))
                }))
            })),
            classifiers: context.classifiers.map(clf => ({
                ...clf,
                name: this.escapeJson(clf.name)
            })),
            links: context.links.map(link => ({
                ...link,
                relationName: link.relationName ? this.escapeJson(link.relationName) : link.relationName
            })),
            diagramName: this.escapeJson(context.diagramName)
        };
    }

    protected escapeContextForCsv(context: ExportContext): ExportContext {
        return {
            ...context,
            instances: context.instances.map(inst => ({
                ...inst,
                name: this.escapeCsv(inst.name),
                classifierName: this.escapeCsv(inst.classifierName),
                slots: inst.slots.map(slot => ({
                    ...slot,
                    featureName: this.escapeCsv(slot.featureName),
                    value: this.escapeCsv(slot.value),
                    values: slot.values.map(v => this.escapeCsv(v))
                }))
            })),
            classifiers: context.classifiers.map(clf => ({
                ...clf,
                name: this.escapeCsv(clf.name)
            })),
            links: context.links.map(link => ({
                ...link,
                relationName: link.relationName ? this.escapeCsv(link.relationName) : link.relationName
            })),
            diagramName: this.escapeCsv(context.diagramName)
        };
    }

    protected escapeContextForXml(context: ExportContext): ExportContext {
        return {
            ...context,
            instances: context.instances.map(inst => ({
                ...inst,
                name: this.escapeXml(inst.name),
                classifierName: this.escapeXml(inst.classifierName),
                slots: inst.slots.map(slot => ({
                    ...slot,
                    featureName: this.escapeXml(slot.featureName),
                    value: this.escapeXml(slot.value),
                    values: slot.values.map(v => this.escapeXml(v))
                }))
            })),
            classifiers: context.classifiers.map(clf => ({
                ...clf,
                name: this.escapeXml(clf.name)
            })),
            links: context.links.map(link => ({
                ...link,
                relationName: link.relationName ? this.escapeXml(link.relationName) : link.relationName
            })),
            diagramName: this.escapeXml(context.diagramName)
        };
    }

    protected escapeJson(value: string): string {
        return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    }

    protected escapeCsv(value: string): string {
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }

    protected escapeXml(value: string): string {
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }
}
