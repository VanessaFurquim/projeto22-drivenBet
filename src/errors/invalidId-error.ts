export function invalidIdError( { messageComplement, id } ) {
    return {
      name: "InvalidIdError",
      message: `${messageComplement} not found! No register found under this ID: ${id}.`
    };
  };