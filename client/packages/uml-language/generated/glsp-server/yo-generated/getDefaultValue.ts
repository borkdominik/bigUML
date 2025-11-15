// THIS FILE IS GENERATED — DO NOT EDIT

interface DefaultMappingEntry {
  property: string;
  propertyType: string;
  defaultValue?: any;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = {
  Model: [
    {
      property: 'elements',
      propertyType: 'Element',
    },
  ],
  Element: [
    {
      property: 'name',
      propertyType: 'string',
    },
  ],
};

export const noBoundsClasses = new Set<string>([]);

export const astTypeMapping: Record<string, string> = {};

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
