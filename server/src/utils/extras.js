import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from 'date-fns';

export const calculateAge = (dob) => {
  const today = new Date();

  const years = differenceInYears(today, dob);
  const months = differenceInMonths(today, dob) % 12;

  const pastDate = new Date(today);
  pastDate.setFullYear(today.getFullYear() - years);
  pastDate.setMonth(today.getMonth() - months);

  const days = differenceInDays(today, pastDate);

  if (years >= 3) {
    return `${years} years`;
  } else if (years > 0) {
    return `${years} years, ${months} months`;
  }
  return `${months} months, ${days} days`;
};

export const randomString = function (length = 6) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return Array.from(
    { length },
    () => letters[Math.floor(Math.random() * letters.length)],
  ).join('');
};
