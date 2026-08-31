export function formatIssuePath(path: PropertyKey[]): string {
  return path.reduce<string>((formatted, segment) => {
    const key = String(segment);
    if (typeof segment === "number") {
      return `${formatted}[${key}]`;
    }
    return formatted === "" ? key : `${formatted}.${key}`;
  }, "");
}
