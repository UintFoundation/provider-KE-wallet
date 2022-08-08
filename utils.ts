export const getActualAmount = (amount: string, decimals: number): number => {
    return parseInt(amount, 10) / 10 ** decimals;
};
