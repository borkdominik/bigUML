import { EmptyFileSystem, URI } from 'langium';
import { createUmlDiagramServices } from './build/env/index.js';

const services = createUmlDiagramServices({ ...EmptyFileSystem, connection: undefined });
const uml = services.UmlDiagram;

const content = JSON.stringify(
    {
        diagram: {
            __type: 'StateMachineDiagram',
            __id: 'diagram_1',
            diagramType: 'STATE_MACHINE',
            entities: [
                {
                    __type: 'State',
                    __id: 'State_1',
                    name: 'X',
                    entry: 'setup',
                    doActivity: 'print the report',
                    exit: 'tearDown()',
                    visibility: 'PUBLIC',
                    regions: []
                }
            ],
            relations: []
        },
        metaInfos: []
    },
    undefined,
    4
);

const doc = services.shared.workspace.LangiumDocumentFactory.fromString(content, URI.parse('file:///verify.uml'));
await services.shared.workspace.DocumentBuilder.build([doc], { validation: true });

const errors = [...doc.parseResult.parserErrors, ...doc.parseResult.lexerErrors];
console.log('parser/lexer errors:', errors.length, errors.map(e => e.message));
console.log('validation:', (doc.diagnostics ?? []).map(d => d.message));

const state = doc.parseResult.value?.diagram?.entities?.[0];
console.log('parsed state:', {
    name: state?.name,
    entry: state?.entry,
    doActivity: state?.doActivity,
    exit: state?.exit
});

const serialized = uml.serializer.Serializer.serialize(doc.parseResult.value);
console.log('--- re-serialized ---');
console.log(typeof serialized === 'string' ? serialized : JSON.stringify(serialized, undefined, 4));
