export function insufficientDataError( { messageComplement } ) {
    return {
        name: "InsufficientDataError",
        message: `You must provide ${messageComplement} to continue.`
    };
};