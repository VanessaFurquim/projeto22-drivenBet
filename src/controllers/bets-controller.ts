import { BetInputBody } from "@/protocols";
import { betsRepository } from "@/repositories/bets-repository";
import { betsService } from "@/services/bets-service";
import { Bet } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function createNew(request: Request, response: Response): Promise<void> {
    const betData = request.body as BetInputBody;

    const bet: Bet = await betsService.createNew(betData);
  
    response.status(httpStatus.CREATED).send(bet);
};

export const betsController = {
    createNew
};