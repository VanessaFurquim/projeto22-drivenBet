import prisma from "@/database/databaseConnection";
import { noBetsPlacedError } from "@/errors/noBetsPlaced-error";
import { FinalScoreInputBody } from "@/utils/protocols";
import { Bet, Game } from "@prisma/client";

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
  const games: Game[] = await prisma.game.findMany();

  return games;
};

async function selectOneWithBets(gameId: number): Promise<Game & { Bet: Bet[] }> {
  const requestResult: Game & { Bet: Bet[] } = await prisma.game.findFirst({
    where: {
      id: gameId,
    },
    include: {
      Bet: true,
    }
  });

  const gameWithBets = {
    ...requestResult,
    bets: requestResult?.Bet,
  } as Game & { Bet: Bet[] };
  
  delete gameWithBets.Bet;

  return gameWithBets;
};

async function selectOneById(gameId: number): Promise<Game> {
  const game: Game = await prisma.game.findFirst({
    where: {
      id: gameId,
    }
  });

  return game;
};

async function wereAnyBetsPlaced(gameId: number): Promise<Bet[]> {
  const bets: Bet[] = await prisma.bet.findMany({
    where: {
      gameId
    }
  });

  if (!bets) throw noBetsPlacedError();

  return bets;
};

async function updateOne(gameId: number, { homeTeamScore, awayTeamScore }: FinalScoreInputBody): Promise<Game> {
  const finishedGame: Game = await prisma.game.update({
    where: {
      id: gameId
    },
    data: {
      homeTeamScore,
      awayTeamScore,
      isFinished: true
    },
  });

  return finishedGame;
};

async function updateBetAndBalance(betId: number, status: string, amountWon: number): Promise<Bet> {
  const settledBetAndUpdatedBalance: Bet = await prisma.bet.update({
    where: {
      id: betId
    },
    data: { 
      status,
      amountWon,
      participant: {
        update: {
          data: {
            balance: {
              increment: amountWon
            }
          }
        }
      }
    }
  });

  return settledBetAndUpdatedBalance;
};

export const gamesRepository = {
  insertNew,
  selectAll,
  selectOneWithBets,

  selectOneById,
  wereAnyBetsPlaced,
  updateOne,
  updateBetAndBalance
};