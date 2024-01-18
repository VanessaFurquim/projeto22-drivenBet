import prisma from "@/database/databaseConnection";
import { invalidIdError } from "@/errors/invalidId-error";
import { BetInputBody } from "@/utils/protocols";
import { Bet, Participant } from "@prisma/client";

async function insertNew(betData: BetInputBody) {
    const bet: Bet = await prisma.bet.create({
        data: betData
    });

    return bet;
};

async function selectBalance(participantId: number) {
    const participant = await prisma.participant.findFirst({
        where: {
            id: participantId
        },
        select: {
            balance: true,
        }
    });

    return participant?.balance ?? (() => { throw invalidIdError( { messageComplement: "Participant", id: participantId } ); })();
};

async function selectGameStatus(gameId: number) {
    const game = await prisma.game.findFirst({
        where: {
            id: gameId
        },
        select: {
            isFinished: true,
        }
    });

    return game?.isFinished ?? (() => { throw invalidIdError( { messageComplement: "Game", id: gameId } ); })();
};

async function calculatingNewBalance(participantId: number, amountBet: number): Promise<Participant> {
    return prisma.participant.update({
      where: {
        id: participantId,
      },
      data: {
        balance: {
          decrement: amountBet,
        },
      }
    });
  };

export const betsRepository = {
    insertNew,
    selectBalance,
    selectGameStatus,
    calculatingNewBalance
};