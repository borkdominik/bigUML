const mapping: Record<
  string,
  Array<{ property: string; allowedChildTypes?: string[] }>
> = {};

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
