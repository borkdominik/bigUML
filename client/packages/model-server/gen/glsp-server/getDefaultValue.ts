// THIS FILE IS GENERATED — DO NOT EDIT

interface DefaultMappingEntry {
  property: string;
  propertyType: string;
  defaultValue?: any;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = {
  Diagram: [
    {
      property: 'diagram',
      propertyType: 'UnionType_0',
    },
  ],
  ElementWithSizeAndPosition: [],
  Entity: [],
  MetaInfo: [],
  Size: [
    {
      property: 'height',
      propertyType: 'number',
    },
    {
      property: 'width',
      propertyType: 'number',
    },
    {
      property: 'element',
      propertyType: 'ElementWithSizeAndPosition',
    },
  ],
  Position: [
    {
      property: 'x',
      propertyType: 'number',
    },
    {
      property: 'y',
      propertyType: 'number',
    },
    {
      property: 'element',
      propertyType: 'ElementWithSizeAndPosition',
    },
  ],
  ClassDiagram: [
    {
      property: 'diagramType',
      propertyType: '"\\"CLASS\\""',
    },
    {
      property: 'entities',
      propertyType: 'Entity',
    },
    {
      property: 'relations',
      propertyType: 'Relation',
    },
  ],
  Enumeration: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'values',
      propertyType: 'EnumerationLiteral',
    },
  ],
  EnumerationLiteral: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'value',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
  ],
  Class: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'isAbstract',
      propertyType: 'boolean',
      defaultValue: false,
    },
    {
      property: 'properties',
      propertyType: 'Property',
    },
    {
      property: 'operations',
      propertyType: 'Operation',
    },
    {
      property: 'isActive',
      propertyType: 'boolean',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'skip',
      propertyType: 'boolean',
    },
  ],
  Test: [
    {
      property: 'name',
      propertyType: 'string',
    },
  ],
  AbstractClass: [
    {
      property: 'isAbstract',
      propertyType: 'boolean',
      defaultValue: true,
    },
    {
      property: 'label',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'properties',
      propertyType: 'Property',
    },
    {
      property: 'operations',
      propertyType: 'Operation',
    },
    {
      property: 'isActive',
      propertyType: 'boolean',
    },
    {
      property: 'skip',
      propertyType: 'boolean',
    },
  ],
  Interface: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'properties',
      propertyType: 'Property',
    },
    {
      property: 'operations',
      propertyType: 'Operation',
    },
  ],
  Property: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'isDerived',
      propertyType: 'boolean',
      defaultValue: false,
    },
    {
      property: 'isOrdered',
      propertyType: 'boolean',
      defaultValue: false,
    },
    {
      property: 'isStatic',
      propertyType: 'boolean',
      defaultValue: false,
    },
    {
      property: 'isDerivedUnion',
      propertyType: 'boolean',
      defaultValue: false,
    },
    {
      property: 'isReadOnly',
      propertyType: 'boolean',
      defaultValue: false,
    },
    {
      property: 'isUnique',
      propertyType: 'boolean',
      defaultValue: false,
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
      defaultValue: 'PUBLIC',
    },
  ],
  Operation: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'isAbstract',
      propertyType: 'boolean',
    },
    {
      property: 'isStatic',
      propertyType: 'boolean',
    },
    {
      property: 'isQuery',
      propertyType: 'boolean',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'concurrency',
      propertyType: 'Concurrency',
    },
    {
      property: 'parameters',
      propertyType: 'Parameter',
    },
  ],
  Parameter: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'isException',
      propertyType: 'boolean',
    },
    {
      property: 'isStream',
      propertyType: 'boolean',
    },
    {
      property: 'isOrdered',
      propertyType: 'boolean',
    },
    {
      property: 'isUnique',
      propertyType: 'boolean',
    },
    {
      property: 'direction',
      propertyType: 'ParameterDirection',
    },
    {
      property: 'effect',
      propertyType: 'EffectType',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'parameterType',
      propertyType: 'DataTypeReference',
    },
    {
      property: 'multiplicity',
      propertyType: 'string',
    },
  ],
  DataType: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'properties',
      propertyType: 'Property',
    },
    {
      property: 'operations',
      propertyType: 'Operation',
    },
    {
      property: 'isAbstract',
      propertyType: 'boolean',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
  ],
  PrimitiveType: [
    {
      property: 'name',
      propertyType: 'string',
    },
  ],
  InstanceSpecification: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'slots',
      propertyType: 'Slot',
    },
  ],
  Slot: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'values',
      propertyType: 'LiteralSpecification',
      defaultValue: '[]',
    },
  ],
  LiteralSpecification: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'value',
      propertyType: 'string',
    },
  ],
  Relation: [
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Abstraction: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Dependency: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Association: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'sourceMultiplicity',
      propertyType: 'string',
      defaultValue: '*',
    },
    {
      property: 'targetMultiplicity',
      propertyType: 'string',
      defaultValue: '*',
    },
    {
      property: 'sourceName',
      propertyType: 'string',
    },
    {
      property: 'targetName',
      propertyType: 'string',
    },
    {
      property: 'sourceAggregation',
      propertyType: 'AggregationType',
      defaultValue: 'NONE',
    },
    {
      property: 'targetAggregation',
      propertyType: 'AggregationType',
      defaultValue: 'NONE',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Aggregation: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'sourceMultiplicity',
      propertyType: 'string',
      defaultValue: '*',
    },
    {
      property: 'targetMultiplicity',
      propertyType: 'string',
      defaultValue: '*',
    },
    {
      property: 'sourceName',
      propertyType: 'string',
    },
    {
      property: 'targetName',
      propertyType: 'string',
    },
    {
      property: 'sourceAggregation',
      propertyType: 'AggregationType',
      defaultValue: 'SHARED',
    },
    {
      property: 'targetAggregation',
      propertyType: 'AggregationType',
      defaultValue: 'NONE',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Composition: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'sourceMultiplicity',
      propertyType: 'string',
      defaultValue: '*',
    },
    {
      property: 'targetMultiplicity',
      propertyType: 'string',
      defaultValue: '*',
    },
    {
      property: 'sourceName',
      propertyType: 'string',
    },
    {
      property: 'targetName',
      propertyType: 'string',
    },
    {
      property: 'sourceAggregation',
      propertyType: 'AggregationType',
      defaultValue: 'COMPOSITE',
    },
    {
      property: 'targetAggregation',
      propertyType: 'AggregationType',
      defaultValue: 'NONE',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  InterfaceRealization: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Generalization: [
    {
      property: 'isSubstitutable',
      propertyType: 'boolean',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  PackageImport: [
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  PackageMerge: [
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Realization: [
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Substitution: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  Usage: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'source',
      propertyType: 'Entity',
    },
    {
      property: 'target',
      propertyType: 'Entity',
    },
    {
      property: 'relationType',
      propertyType: 'RelationType',
    },
  ],
  StateMachineDiagram: [
    {
      property: 'diagramType',
      propertyType: '"\\"STATE_MACHINE\\""',
    },
  ],
  PackageDiagram: [
    {
      property: 'diagramType',
      propertyType: '"\\"PACKAGE\\""',
    },
    {
      property: 'entities',
      propertyType: 'Entity',
    },
    {
      property: 'relations',
      propertyType: 'Relation',
    },
  ],
  Package: [
    {
      property: 'name',
      propertyType: 'string',
    },
    {
      property: 'uri',
      propertyType: 'string',
    },
    {
      property: 'visibility',
      propertyType: 'Visibility',
    },
    {
      property: 'entities',
      propertyType: 'Entity',
    },
  ],
};

export const noBoundsClasses = new Set<string>([
  'EnumerationLiteral',
  'Property',
  'Operation',
  'Parameter',
  'Slot',
]);

export const astTypeMapping: Record<string, string> = {
  aggregation: 'Association',
  composition: 'Association',
};

export function isNoBounds(typeId: string): boolean {
  return noBoundsClasses.has(stripPrefix(typeId));
}

export function getProperties(elementTypeId: string): DefaultMappingEntry[] {
  const parentType = elementTypeId.startsWith('edge')
    ? (() => {
        const s = getRelationTypeFromElementId(
          elementTypeId,
          true,
        ).toLowerCase();
        return s.charAt(0).toUpperCase() + s.slice(1);
      })()
    : stripPrefix(elementTypeId);
  const entries = defaultMapping[parentType] || [];
  return entries.reduce((acc, e) => {
    if (e.defaultValue !== undefined) {
      if (e.defaultValue === '[]') {
        acc.push({ ...e, defaultValue: [] });
      } else {
        acc.push(e);
      }
      return acc;
    }

    switch (e.propertyType) {
      case 'string':
        return acc;
      case 'boolean':
        acc.push({ ...e, defaultValue: false });
        return acc;
      case 'number':
        acc.push({ ...e, defaultValue: 0 });
        return acc;
      case 'Visibility':
        acc.push({ ...e, defaultValue: 'PUBLIC' });
        return acc;
      case 'Concurrency':
        acc.push({ ...e, defaultValue: 'SEQUENTIAL' });
        return acc;
      default:
        acc.push({ ...e, defaultValue: [] });
        return acc;
    }
  }, [] as DefaultMappingEntry[]);
}

function stripPrefix(name: string): string {
  return name.replace(/^.*?__/, '');
}

/**
 * Returns the UPPER_CASE relation type identifier when upperCase is true,
 * otherwise returns the AST edge type name for use in the model.
 */
export function getRelationTypeFromElementId(
  elementTypeId: string,
  upperCase: boolean,
): string {
  const withoutPrefix = elementTypeId.replace(/^.*?__/, '');
  const head = withoutPrefix.split('__')[0];

  if (upperCase) {
    const withUnderscore = head.replace(/([a-z])([A-Z])/g, '$1_$2');
    return withUnderscore.toUpperCase();
  } else {
    const candidate = head.charAt(0).toUpperCase() + head.slice(1);
    const lookup = candidate.toLowerCase();
    if (astTypeMapping[lookup]) {
      return astTypeMapping[lookup];
    }
    return candidate;
  }
}
