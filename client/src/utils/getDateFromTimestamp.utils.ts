export const getDateFromTimestamp = (timestamp: any): Date => {
    if (timestamp._seconds === undefined) return timestamp;
    return (new Date( (timestamp._seconds + timestamp._nanoseconds * 10 ** -9) * 1000))
};
