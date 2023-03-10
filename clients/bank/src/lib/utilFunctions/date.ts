import dateFormat from 'dateformat';

export function isoDate(value: number | string | Date): string {
  return dateFormat(value, 'yyyy-mm-dd');
}

export function getTime(value: number | string | Date = new Date()): number {
  const getTimeDate = (value: Parameters<typeof getTime>[0] = new Date()) => new Date(value).getTime();

  if (isNaN(getTimeDate(value))) return getTimeDate();

  return getTimeDate(value);
}
