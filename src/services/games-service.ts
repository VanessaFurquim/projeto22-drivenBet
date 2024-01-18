import { gamesRepository } from "@/repositories/games-repository";
import { Game } from "@prisma/client";

async function createNew(homeTeamName: string, awayTeamName: string) {
    const game: Game = await gamesRepository.insertNew(homeTeamName, awayTeamName);

    return game;
};

async function listAll() {
    const games: Game[] = await gamesRepository.selectAll();

    return games;
};

async function listgameWithBets(gameId: number) {
    const gameWithBets = await gamesRepository.selectGameWithBets(gameId);

    return gameWithBets;
};

export const gamesService = {
    createNew,
    listAll,
    listgameWithBets
};