export function toKebabCase(value: string | number | null | undefined): string {
  if (value == null) return 'unknown';
  return String(value)
    .trim()
    .replace(/[, _]+/g, '-')
    .replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
};

export function useDataTestIdWithPath(
  pathName: string,
  type: string,
  name: string | null | undefined,
  dataTestId?: string
): string {
  const kebabPathName = pathName.split('/').filter(Boolean).join('-');
  const kebabName = toKebabCase(name);
  return dataTestId ? dataTestId : `${kebabPathName}-${type}-${kebabName}`;
}
