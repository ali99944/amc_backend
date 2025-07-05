import moment from 'moment-timezone';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DEFAULT_TIMEZONE = 'UTC'; // Or your preferred default timezone

/**
 * Formats a date object or string into a specified format and timezone.
 * @param {Date|string|moment.Moment} date - The date to format.
 * @param {string} [format=DEFAULT_DATE_FORMAT] - The desired output format.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The target timezone.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date, format = DEFAULT_DATE_FORMAT, timezone = DEFAULT_TIMEZONE) => {
  return moment(date).tz(timezone).format(format);
};

/**
 * Gets the current date and time, formatted and in the specified timezone.
 * @param {string} [format=DEFAULT_DATE_FORMAT] - The desired output format.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The target timezone.
 * @returns {string} The current formatted date string.
 */
export const getCurrentDate = (format = DEFAULT_DATE_FORMAT, timezone = DEFAULT_TIMEZONE) => {
  return moment().tz(timezone).format(format);
};

/**
 * Gets the current timestamp in milliseconds.
 * @returns {number} The current timestamp.
 */
export const getCurrentTimestamp = () => moment().valueOf();

/**
 * Adds a specified amount of time to a date.
 * @param {Date|string|moment.Moment} date - The starting date.
 * @param {number} amount - The amount of time to add.
 * @param {moment.unitOfTime.DurationConstructor} unit - The unit of time (e.g., 'days', 'hours').
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone for the operation.
 * @returns {moment.Moment} A new moment object with the added time.
 */
export const addTime = (date, amount, unit, timezone = DEFAULT_TIMEZONE) => {
  return moment(date).tz(timezone).add(amount, unit);
};

/**
 * Subtracts a specified amount of time from a date.
 * @param {Date|string|moment.Moment} date - The starting date.
 * @param {number} amount - The amount of time to subtract.
 * @param {moment.unitOfTime.DurationConstructor} unit - The unit of time (e.g., 'days', 'hours').
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone for the operation.
 * @returns {moment.Moment} A new moment object with the subtracted time.
 */
export const subtractTime = (date, amount, unit, timezone = DEFAULT_TIMEZONE) => {
  return moment(date).tz(timezone).subtract(amount, unit);
};

/**
 * Calculates the difference between two dates in a specified unit.
 * @param {Date|string|moment.Moment} date1 - The first date.
 * @param {Date|string|moment.Moment} date2 - The second date.
 * @param {moment.unitOfTime.Diff} [unit='milliseconds'] - The unit for the difference.
 * @param {boolean} [precise=false] - Whether to return a precise (floating-point) difference.
 * @returns {number} The difference between the dates.
 */
export const dateDiff = (date1, date2, unit = 'milliseconds', precise = false) => {
  return moment(date1).diff(moment(date2), unit, precise);
};

/**
 * Checks if a date is before another date.
 * @param {Date|string|moment.Moment} date1 - The date to check.
 * @param {Date|string|moment.Moment} date2 - The date to compare against.
 * @param {moment.unitOfTime.StartOf} [granularity] - The precision for comparison (e.g., 'day').
 * @returns {boolean} True if date1 is before date2, false otherwise.
 */
export const isBefore = (date1, date2, granularity) => {
  return moment(date1).isBefore(moment(date2), granularity);
};

/**
 * Checks if a date is after another date.
 * @param {Date|string|moment.Moment} date1 - The date to check.
 * @param {Date|string|moment.Moment} date2 - The date to compare against.
 * @param {moment.unitOfTime.StartOf} [granularity] - The precision for comparison (e.g., 'day').
 * @returns {boolean} True if date1 is after date2, false otherwise.
 */
export const isAfter = (date1, date2, granularity) => {
  return moment(date1).isAfter(moment(date2), granularity);
};

/**
 * Checks if a date is the same as another date.
 * @param {Date|string|moment.Moment} date1 - The date to check.
 * @param {Date|string|moment.Moment} date2 - The date to compare against.
 * @param {moment.unitOfTime.StartOf} [granularity] - The precision for comparison (e.g., 'day').
 * @returns {boolean} True if date1 is the same as date2, false otherwise.
 */
export const isSame = (date1, date2, granularity) => {
  return moment(date1).isSame(moment(date2), granularity);
};

/**
 * Checks if a given string or Date object is a valid date according to moment.js.
 * @param {any} dateInput - The input to validate.
 * @returns {boolean} True if the input is a valid date, false otherwise.
 */
export const isValidDate = (dateInput) => {
  return moment(dateInput).isValid();
};

/**
 * Parses a date string into a moment object.
 * @param {string} dateString - The date string to parse.
 * @param {string|string[]} [format] - The expected format(s) of the date string.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone to interpret the date in.
 * @returns {moment.Moment} The parsed moment object.
 */
export const parseDate = (dateString, format, timezone = DEFAULT_TIMEZONE) => {
  return moment(dateString, format).tz(timezone);
};

/**
 * Gets the start of a specific time unit for a given date.
 * @param {Date|string|moment.Moment} date - The date.
 * @param {moment.unitOfTime.StartOf} unit - The time unit (e.g., 'day', 'month', 'year').
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone for the operation.
 * @returns {moment.Moment} A moment object representing the start of the unit.
 */
export const startOf = (date, unit, timezone = DEFAULT_TIMEZONE) => {
  return moment(date).tz(timezone).startOf(unit);
};

/**
 * Gets the end of a specific time unit for a given date.
 * @param {Date|string|moment.Moment} date - The date.
 * @param {moment.unitOfTime.StartOf} unit - The time unit (e.g., 'day', 'month', 'year').
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone for the operation.
 * @returns {moment.Moment} A moment object representing the end of the unit.
 */
export const endOf = (date, unit, timezone = DEFAULT_TIMEZONE) => {
  return moment(date).tz(timezone).endOf(unit);
};

/**
 * Formats a date into a human-readable relative time string (e.g., "2 hours ago", "in 3 days").
 * @param {Date|string|moment.Moment} date - The date to format.
 * @param {boolean} [withoutSuffix=false] - If true, omits the "ago" or "in" part.
 * @returns {string} The relative time string.
 */
export const humanizeDuration = (date, withoutSuffix = false) => {
  return moment(date).fromNow(withoutSuffix);
};

/**
 * Gets the day of the week for a given date.
 * @param {Date|string|moment.Moment} date - The date.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone for the operation.
 * @returns {number} The day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday).
 */
export const dayOfWeek = (date, timezone = DEFAULT_TIMEZONE) => {
  return moment(date).tz(timezone).day();
};

/**
 * Gets the week of the year for a given date.
 * @param {Date|string|moment.Moment} date - The date.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone for the operation.
 * @returns {number} The week of the year.
 */
export const weekOfYear = (date, timezone = DEFAULT_TIMEZONE) => {
  return moment(date).tz(timezone).week();
};

/**
 * Checks if a year is a leap year.
 * @param {number|Date|string|moment.Moment} yearInput - The year or a date within the year.
 * @returns {boolean} True if it's a leap year, false otherwise.
 */
export const isLeapYear = (yearInput) => {
  return moment(yearInput).isLeapYear();
};

/**
 * Gets the number of days in a specific month of a year.
 * @param {Date|string|moment.Moment} dateInMonth - A date within the desired month and year.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The timezone for the operation.
 * @returns {number} The number of days in the month.
 */
export const daysInMonth = (dateInMonth, timezone = DEFAULT_TIMEZONE) => {
  return moment(dateInMonth).tz(timezone).daysInMonth();
};

/**
 * Converts a date to a different timezone.
 * @param {Date|string|moment.Moment} date - The date to convert.
 * @param {string} targetTimezone - The timezone to convert to.
 * @returns {moment.Moment} A new moment object in the target timezone.
 */
export const convertTimezone = (date, targetTimezone) => {
  return moment(date).tz(targetTimezone);
};

/**
 * Get an array of dates between two dates
 * @param {Date|string|moment.Moment} startDate - The start date
 * @param {Date|string|moment.Moment} endDate - The end date
 * @param {moment.unitOfTime.DurationConstructor} [unit='days'] - The unit to increment by (e.g., 'days', 'weeks')
 * @param {string} [format=DEFAULT_DATE_FORMAT] - The format for the dates in the array
 * @returns {string[]} An array of formatted date strings
 */
export const getDateRange = (startDate, endDate, unit = 'days', format = DEFAULT_DATE_FORMAT) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const range = [];
  let current = start.clone();

  while (current.isSameOrBefore(end, unit === 'months' ? 'month' : unit === 'years' ? 'year' : 'day')) {
    range.push(current.format(format));
    current.add(1, unit);
  }
  return range;
};

export { DEFAULT_DATE_FORMAT, DEFAULT_TIMEZONE };
