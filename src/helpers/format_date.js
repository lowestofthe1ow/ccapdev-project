/**
 * Formats a Date object to a more readable format.
 *
 * @param date - The date to format
 */
export default (date) => {


    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    const now = new Date();
    const diffMs = date - now;

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
    const seconds = diffMs / 1000;
    const minutes = diffMs / (1000 * 60);
    const hours = diffMs / (1000 * 60 * 60);
    const days = diffMs / (1000 * 60 * 60 * 24);
  
    if (Math.abs(days) >= 1) {
      return rtf.format(Math.round(days), 'day');
    } else if (Math.abs(hours) >= 1) {
      return rtf.format(Math.round(hours), 'hour');
    } else if (Math.abs(minutes) >= 1) {
      return rtf.format(Math.round(minutes), 'minute');
    } else {
      return rtf.format(Math.round(seconds), 'second');
    }


    /* TODO: Actually format the date to a relative time, e.g. "7 hours ago" */
    // return date.toLocaleString();

    
};
