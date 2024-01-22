export function insufficientBalanceError( { messageComplement } ) {
    return {
        name: "InsufficientBalanceError",
        message: `Insuficient funds! ${messageComplement}`
    };
};