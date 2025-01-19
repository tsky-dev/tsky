export function getDescriptions(def: { description?: string }): string[] {
  const descs: string[] = [];
  if (def.description) {
    descs.push(def.description);
    if (def.description.toLowerCase().startsWith('deprecated')) {
      descs.push('@deprecated');
    }
  }
  return descs;
}

export function writeJsdoc(descriptions: string[]) {
  if (!descriptions.length) return '';

  const escaped = descriptions.map((desc) =>
    desc.replace(/\*\//g, '*\\/').replace(/@/g, '\\@'),
  );

  if (escaped.length === 1) {
    return `\n/** ${escaped[0]} */\n`;
  }

  return `\n/**${escaped.map((desc) => `\n * ${desc}`).join('')}\n */\n`;
}
