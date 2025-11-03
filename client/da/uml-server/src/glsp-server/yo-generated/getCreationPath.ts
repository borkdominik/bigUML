const mapping: Record<
  string,
  Array<{ property: string; allowedChildTypes?: string[] }>
> = {
  Enumeration: [
    {
      property: 'values',
      allowedChildTypes: ['EnumerationLiteral'],
    },
  ],
  Class: [
    {
      property: 'properties',
      allowedChildTypes: ['Property'],
    },
    {
      property: 'operations',
      allowedChildTypes: ['Operation'],
    },
  ],
  AbstractClass: [
    {
      property: 'properties',
      allowedChildTypes: ['Property'],
    },
    {
      property: 'operations',
      allowedChildTypes: ['Operation'],
    },
  ],
  Interface: [
    {
      property: 'properties',
      allowedChildTypes: ['Property'],
    },
    {
      property: 'operations',
      allowedChildTypes: ['Operation'],
    },
  ],
  Operation: [
    {
      property: 'parameters',
      allowedChildTypes: ['Parameter'],
    },
  ],
  DataType: [
    {
      property: 'properties',
      allowedChildTypes: ['Property'],
    },
    {
      property: 'operations',
      allowedChildTypes: ['Operation'],
    },
  ],
  InstanceSpecification: [
    {
      property: 'slots',
      allowedChildTypes: ['Slot'],
    },
  ],
  Slot: [
    {
      property: 'values',
      allowedChildTypes: ['LiteralSpecification'],
    },
  ],
  PackageDiagram: [
    {
      property: 'entities',
      allowedChildTypes: [
        'Enumeration',
        'Class',
        'Interface',
        'DataType',
        'PrimitiveType',
        'InstanceSpecification',
        'Package',
      ],
    },
    {
      property: 'relations',
      allowedChildTypes: [
        'Abstraction',
        'Dependency',
        'Association',
        'Aggregation',
        'Composition',
        'InterfaceRealization',
        'Generalization',
        'PackageImport',
        'PackageMerge',
        'Realization',
        'Substitution',
        'Usage',
      ],
    },
  ],
  Package: [
    {
      property: 'entities',
      allowedChildTypes: [
        'Enumeration',
        'Class',
        'Interface',
        'DataType',
        'PrimitiveType',
        'InstanceSpecification',
        'Package',
      ],
    },
  ],
};

function stripPrefix(name: string): string {
  return name.replace(/^.*?__/, '');
}

function pluralise(type: string): string {
  return type.endsWith('y') ? type.slice(0, -1) + 'ies' : type + 's';
}

export function getCreationPath(
  parentType: string,
  childType: string,
): string | undefined {
  const parentKey = stripPrefix(parentType);
  const childKey = stripPrefix(childType);

  if (mapping[parentKey]) {
    console.log('parentKey ', parentKey);
    for (const entry of mapping[parentKey]) {
      if (
        entry.allowedChildTypes &&
        entry.allowedChildTypes.includes(childKey)
      ) {
        return entry.property;
      }
    }
  }
  return undefined;
}
