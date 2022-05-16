export function reassign(
  target: Record<string, any>,
  source: Record<string, any>,
) {
  const targetKeys = new Set(Object.keys(target));
  const sourceKeys = new Set(Object.keys(source));

  // delete abandoned keys
  targetKeys.forEach((tKey) => {
    if (!sourceKeys.has(tKey)) {
      if (!tKey.startsWith('_')) {
        delete target[tKey];
      }
    }
  });

  // assign the rest
  sourceKeys.forEach((sKey) => {
    const sourceVal = source[sKey];
    const sourceValIsObject =
      typeof sourceVal === 'object' && sourceVal !== null;

    const targetVal = target[sKey];
    const targetValIsObject =
      typeof targetVal === 'object' && targetVal !== null;

    if (
      Array.isArray(sourceVal) &&
      Array.isArray(targetVal) &&
      targetVal.length > sourceVal.length
    ) {
      targetVal.splice(0, targetVal.length - sourceVal.length);
    }

    if (sourceValIsObject && targetValIsObject) {
      reassign(targetVal, sourceVal);
    } else {
      target[sKey] = sourceVal;
    }
  });
}
