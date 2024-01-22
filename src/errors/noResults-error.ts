export function noResultError( { messageComplement } ) {
    return {
        name: "NoResultError",
        message: `Results not found! There are no ${messageComplement} registered yet.`
    };
};