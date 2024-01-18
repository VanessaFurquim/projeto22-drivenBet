import prisma from "@/database/databaseConnection";
import { Game } from "@prisma/client";

async function insertNew(homeTeamName: string, awayTeamName: string): Promise<Game> {
  const game: Game = await prisma.game.create({
    data: {
      homeTeamName,
      awayTeamName
    }
  });

  return game;
};
  
async function selectAll(): Promise<Game[]> {
  const games = await prisma.game.findMany();

  return games;
};

async function selectGameWithBets(gameId: number) {
  const requestResult = await prisma.game.findFirst({
    where: {
      id: gameId,
    },
    include: {
      Bet: true,
    },
  });

  const gameWithBets = {
    ...requestResult,
    bets: requestResult?.Bet,
  };
  
  delete gameWithBets.Bet;

  return gameWithBets;
};
  
export const gamesRepository = {
  insertNew,
  selectAll,
  selectGameWithBets
};