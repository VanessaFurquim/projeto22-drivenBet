export function invalidBetAmountError(amountBet: number) {
    return {
        name: "InvalidBetAmountError",
        message: `You must place a bet higher than ${amountBet} reais and cannot be a negative value.`
    };
};