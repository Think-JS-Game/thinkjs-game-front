export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class TestClock implements Clock {
  private currentDate: Date;

  constructor(initialDate: Date = new Date()) {
    this.currentDate = new Date(initialDate.getTime());
  }

  now(): Date {
    return new Date(this.currentDate.getTime());
  }

  setCurrentDate(date: Date): void {
    this.currentDate = new Date(date.getTime());
  }

  advanceDays(days: number): void {
    this.currentDate.setDate(this.currentDate.getDate() + days);
  }
}

/**
 * Returns a YYYY-MM-DD string formatted in the user's LOCAL calendar date
 * (instead of UTC toISOString() which shifts dates around midnight).
 */
export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
