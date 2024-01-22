export function isGameOverError( { messageComplement } ) {
    return {
        name: "GameIsOverError",
        message: `The game you selected is ${messageComplement}`
    };
};