export function getFriendlyDateString(date: Date): string {
    return date.toLocaleDateString('en-GB', {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

export function accountForTimezone(date: Date): Date {
    const offset = (date.getTimezoneOffset() / 60) * -1;
    date.setHours(date.getHours() + offset)
    return date;
}