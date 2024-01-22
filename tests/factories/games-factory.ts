import { faker } from "@faker-js/faker";
import prisma from "@/database/databaseConnection";
import { FinalScoreInputBody, GameInputBody } from "@/utils/protocols";
import { Bet, Game } from "@prisma/client";

function createMockGame(): GameInputBody {
    const mockGameInputBody: GameInputBody = {
        homeTeamName: faker.location.state() + " " + faker.animal.type() +"s",
        awayTeamName: faker.location.state() + " " + faker.animal.type() +"s"
    };

    return mockGameInputBody;
};

async function addMockGame(isFinished: boolean): Promise<Game> {
    const mockGame: GameInputBody = createMockGame();
    const game: Game = await prisma.game.create({
        data: {
            ...mockGame,
            homeTeamScore: 0,
            awayTeamScore: 0,
            isFinished
        },
    });

    return game;
};

async function getBetsByGameId(gameId: number): Promise<Bet[]> {
    const mockBets: Bet[] = await prisma.bet.findMany({
      where: {
        gameId
      }
    });
  
    return mockBets;
  };
  
async function updateMockGame(gameId: number, { homeTeamScore, awayTeamScore }: FinalScoreInputBody): Promise<Game> {
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

  async function updateMockBetAndMockBalance(betId: number, status: string, amountWon: number): Promise<Bet> {
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

export const gamesFactory = {
    createMockGame,
    addMockGame,
    getBetsByGameId,
    updateMockGame,
    updateMockBetAndMockBalance
};