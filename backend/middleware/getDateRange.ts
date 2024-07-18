import { DateTime } from 'luxon';

function getDateRange(startDate: string, endDate: string): string[] {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  const range = [];

  for (let dt = start; dt <= end; dt = dt.plus({ days: 1 })) {
    range.push(dt.toISODate()!);
  }

  return range;
}

export default getDateRange;
