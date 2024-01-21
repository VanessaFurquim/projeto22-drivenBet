export function isGameOverError(messageComplement: string) {
    return {
      name: "GameIsOverError",
      message: `The game you selected is ${messageComplement}`
    };
  };