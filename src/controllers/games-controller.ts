import { GameInputBody } from "@/utils/protocols";
import { gamesService } from "@/services/games-service";
import { Game } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function createNew(request: Request, response: Response): Promise<void> {
    const { homeTeamName, awayTeamName } = request.body as GameInputBody;
  
    const game: Game = await gamesService.createNew(homeTeamName, awayTeamName);
  
    response.status(httpStatus.CREATED).send(game);
};

export async function listAll(request: Request, response: Response): Promise<void> {
    const games: Game[] = await gamesService.listAll();
  
    response.status(httpStatus.OK).send(games);
};

export async function listOne(request: Request, response: Response): Promise<void> {
    const { gameId } = request.body;
    const gameWithBets = await gamesService.listgameWithBets(gameId);
  
    response.status(httpStatus.OK).send(gameWithBets);
};

export const gamesController = {
    createNew,
    listAll,
    listOne
};