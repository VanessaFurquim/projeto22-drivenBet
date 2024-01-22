import { faker } from "@faker-js/faker";
import prisma from "@/database/databaseConnection";
import { Bet } from "@prisma/client";
import { BetInputBody } from "@/utils/protocols";

function createBet(amountBet: number, gameId: number, participantId: number): BetInputBody {
    const mockBetInputBody: BetInputBody =  {
        homeTeamScore: faker.number.int({ min: 0, max: 10 }),
        awayTeamScore: faker.number.int({ min: 0, max: 10 }),
        amountBet,
        gameId,
        participantId
    };

    return mockBetInputBody;
};
  
async function addBet(amountBet: number, gameId: number, participantId: number) {
    const mockBetInputBody: BetInputBody =  createBet(amountBet, gameId, participantId);

    const mockBet: Bet = await prisma.bet.create({
        data: {
            gameId,
            participantId,
            amountBet,
            homeTeamScore: mockBetInputBody.homeTeamScore,
            awayTeamScore: mockBetInputBody.awayTeamScore,
        },
    });

    return mockBet;
};

export const betsFactory = {
    createBet,
    addBet
};