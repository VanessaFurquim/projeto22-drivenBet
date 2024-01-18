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

export const gamesService = {
    createNew,
    listAll
};