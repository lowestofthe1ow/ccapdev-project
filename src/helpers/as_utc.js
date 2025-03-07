/**
 * {@returns a {@link Date} in UTC}. Used for setting the boundaries for filtering by date.
 * @param {DateConstructor} date - A valid {@link DateConstructor} to use for creating the date
 * @param {number} hours - Sets the hours for the time portion of the new date
 * @param {number} minutes - Sets the minutes for the time portion of the new date
 * @param {number} seconds - Sets the seconds for the time portion of the new date
 * @param {number} milliseconds - Sets the milliseconds for the time portion of the new date
 */
export default (date, hours, minutes, seconds, milliseconds) => {
    if (!date) return null;

    let new_date = new Date(date);
    new_date.setHours(hours, minutes, seconds, milliseconds);

    return new_date;
};
