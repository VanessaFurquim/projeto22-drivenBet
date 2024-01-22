import { isGameOverError } from "@/errors/isGameOver-error";
import { insufficientBalanceError } from "@/errors/insufficientBalance-error";
import { invalidBetAmountError } from "@/errors/invalidBetAmount-error";
import { BetInputBody } from "@/utils/protocols";
import { betsRepository } from "@/repositories/bets-repository";
import { Bet } from "@prisma/client";

async function createNew(betData: BetInputBody) {
    await checkingBetAmountAndBalance(betData);
    await isGameOver(betData);

    await betsRepository.calculatingNewBalance(betData.participantId, betData.amountBet);

    const bet: Bet = await betsRepository.insertNew(betData);

    return bet;
};

async function checkingBetAmountAndBalance(betData: BetInputBody): Promise<void> {
    const { participantId, amountBet } = betData;

    if (amountBet <= 0) throw invalidBetAmountError(amountBet);

    const participantsBalance: number = await betsRepository.selectBalance(participantId);
    if (participantsBalance < amountBet) throw insufficientBalanceError( { messageComplement: "The bet amount you are trying to place is greater than your current balance." } );
};

async function isGameOver(betData: BetInputBody): Promise<void> {
    const { gameId } = betData;

    const isGameFinished: boolean = await betsRepository.selectGameStatus(gameId)
    if (isGameFinished === true) throw isGameOverError( { messageComplement: "already over. Choose an ongoing game to place your bet." } );
};

export const betsService = {
    createNew
};