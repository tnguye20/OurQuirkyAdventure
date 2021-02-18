export const getDateFromTimestamp = (timestamp: any) => {
    return (new Date( (timestamp._seconds + timestamp._nanoseconds * 10 ** -9) * 1000))
};
