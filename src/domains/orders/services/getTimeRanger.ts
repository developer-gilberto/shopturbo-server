export function getTimeRange(daysAgo = 15) {
    const maxDay = 15;
    const dayInSeconds = 60 * 60 * 24;

    if (daysAgo > maxDay) daysAgo = maxDay;

    const now = Math.floor(Date.now() / 1000);
    const timeFrom = now - daysAgo * dayInSeconds;
    const timeTo = now;

    return { timeFrom, timeTo };
}
