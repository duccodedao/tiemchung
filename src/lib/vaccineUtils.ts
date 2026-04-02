import { differenceInDays, differenceInMonths, differenceInYears, intervalToDuration } from 'date-fns';

export function calculateAge(birthDate: Date) {
  const now = new Date();
  const duration = intervalToDuration({ start: birthDate, end: now });
  const totalMonths = differenceInMonths(now, birthDate);
  const totalDays = differenceInDays(now, birthDate);

  return {
    years: duration.years || 0,
    months: duration.months || 0,
    days: duration.days || 0,
    totalMonths,
    totalDays
  };
}

export function getVaccineStatus(ageInMonths: number, minAge: number, maxAge: number) {
  if (ageInMonths < minAge) return 'upcoming';
  if (ageInMonths >= minAge && ageInMonths <= maxAge) return 'due';
  return 'past';
}

export function getVaccinationDays(year: number, month: number): [number, number] {
  const thirdDay = new Date(year, month, 3);
  const dayOfWeek = thirdDay.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  
  if (dayOfWeek === 5) { // Friday
    return [3, 6]; // Fri, Mon
  } else if (dayOfWeek === 6) { // Saturday
    return [5, 6]; // Mon, Tue
  } else if (dayOfWeek === 0) { // Sunday
    return [4, 5]; // Mon, Tue
  } else {
    return [3, 4]; // Normal: 3rd and 4th
  }
}
