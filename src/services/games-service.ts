import { balanceError } from "@/errors/balance-error";
import { gamesRepository } from "@/repositories/games-repository";
import { Game } from "@prisma/client";

async function createNew(homeTeamName: string, awayTeamName: string) {
    // if (balance < 1000) throw balanceError();

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