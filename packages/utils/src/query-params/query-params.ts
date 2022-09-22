export function queryParams(obj: Record<string, any>) {
  const pairs = [];
  Object.keys(obj).forEach(key => {
    let val = obj[key];
    if (typeof val === 'boolean') {
      val = val ? 'true' : 'false';
    }
    if (typeof val !== 'undefined') {
      pairs.push(`${key}=${val}`);
    }
  });
  return `?${pairs.join('&')}`;
}
