import { isGameOverError } from "@/errors/isGameOver-error";
import { invalidIdError } from "@/errors/invalidId-error";
import { gamesRepository } from "@/repositories/games-repository";
import { FinalScoreInputBody, WinningBetsEarningsArray } from "@/utils/protocols";
import { Bet, Game } from "@prisma/client";
import { noBetsPlacedError } from "@/errors/noBetsPlaced-error";

async function createNew(homeTeamName: string, awayTeamName: string): Promise<Game> {
    const game: Game = await gamesRepository.insertNew(homeTeamName, awayTeamName);

    return game;
};

async function listAll(): Promise<Game[]> {
    const games: Game[] = await gamesRepository.selectAll();

    return games;
};

async function listOneWithBets(gameId: number): Promise<Game & { Bet: Bet[] }> {
    const gameWithBets: Game & { Bet: Bet[] } = await gamesRepository.selectOneWithBets(gameId);

    return gameWithBets;
};

async function finishOne(gameId: number, { homeTeamScore, awayTeamScore }: FinalScoreInputBody): Promise<Game> {
    const game: Game = await verifyGameConditions(gameId);
    const bets: Bet[] = await verifyBetsOnGame(gameId);

    const finishedGame: Game = await gamesRepository.updateOne(gameId, { homeTeamScore, awayTeamScore });

    const { totalAllBets, winningBetsTotal, winningBetsArray, losingBetsArray } = betsProcessing(bets, { homeTeamScore, awayTeamScore });

    for (const losingBet of losingBetsArray) {
        const { id } = losingBet as Bet;
        await gamesRepository.updateBetAndBalance(id, "LOST", 0);
    };

    const winningBetsEarnings: WinningBetsEarningsArray = calculatingWinningBetEarnings(winningBetsArray, winningBetsTotal, totalAllBets);

    for (const winningBet of winningBetsEarnings) {
        const { id, amountWon } = winningBet as Bet;
        await gamesRepository.updateBetAndBalance(id, "WON", amountWon);
    };

    return finishedGame;
};

async function verifyGameConditions(gameId: number): Promise<Game> {
    const game: Game = await gamesRepository.selectOneById(gameId);
    
    if (!game) throw invalidIdError({ messageComplement: "Game", id: gameId });
    if (game.isFinished !== false) throw isGameOverError("is already flagged as being finished. Select an ongoing game.");

    return game;
};

async function verifyBetsOnGame(gameId: number): Promise<Bet[]> {
    const placedBets: Bet[] = await gamesRepository.wereAnyBetsPlaced(gameId);

    if(!placedBets) throw noBetsPlacedError();

    return placedBets;
};

function betsProcessing (bets: Bet[], { homeTeamScore, awayTeamScore }: FinalScoreInputBody) {
    const winningBetsArray: Bet[] = [];
    const losingBetsArray: Bet[] = [];
    let totalAllBets: number = 0;
    let winningBetsTotal: number = 0;

    bets.forEach((bet) => {
        totalAllBets += bet.amountBet;

        if (bet.homeTeamScore === homeTeamScore && bet.awayTeamScore === awayTeamScore) {
            
            winningBetsTotal += bet.amountBet;

            winningBetsArray.push(bet);
        } else {
            
            losingBetsArray.push(bet);
        }
    });

    return { totalAllBets, winningBetsTotal, winningBetsArray, losingBetsArray };
}

function calculatingWinningBetEarnings(winningBetsArray: Bet[], winningBetsTotal: number, totalAllBets: number): WinningBetsEarningsArray {
    const houseRake: number = 0.3;

    const winningBetsEarnings: WinningBetsEarningsArray = winningBetsArray.map((bet) => {
        bet.amountWon = Math.floor((bet.amountBet / winningBetsTotal) * totalAllBets * (1 - houseRake));

        return { id: bet.id, participantId: bet.participantId, amountWon: bet.amountWon };
    });

    return winningBetsEarnings;
};

export const gamesService = {
    createNew,
    listAll,
    listOneWithBets,
    finishOne
};