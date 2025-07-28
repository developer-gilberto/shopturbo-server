export function calculateTokenExpirationDate(
    currentTimestamp: number,
    secondsToExpiration: number,
) {
    return new Date(currentTimestamp + secondsToExpiration * 1000);
}
