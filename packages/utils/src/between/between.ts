export function between(content: string, start: string, end: string): string {
  const startIndex = content.indexOf(start);
  if (startIndex === -1) {
    return '';
  }

  const endIndex = content.substring(startIndex + start.length).indexOf(end);
  if (endIndex === -1) {
    return '';
  }

  return content.substring(
    startIndex + start.length,
    startIndex + start.length + endIndex,
  );
}
