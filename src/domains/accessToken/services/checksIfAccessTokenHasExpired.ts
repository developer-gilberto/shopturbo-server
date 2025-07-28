export function checksIfTokenHasExpired(tokenExpirationDate: Date) {
    const now = new Date();
    return now > tokenExpirationDate;
}
