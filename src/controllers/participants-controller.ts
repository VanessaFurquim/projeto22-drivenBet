import { ParticipantInputBody } from "@/utils/protocols";
import { participantsService } from "@/services/participants-service";
import { Participant } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function createNew(request: Request, response: Response): Promise<void> {
    const { name, balance } = request.body as ParticipantInputBody;
  
    const participant: Participant = await participantsService.createNew(name, balance);
  
    response.status(httpStatus.CREATED).send(participant);
};

export async function listAll(request: Request, response: Response): Promise<void> {
    const participants: Participant[] = await participantsService.listAll();
  
    response.status(httpStatus.OK).send(participants);
};

export const participantsController = {
    createNew,
    listAll
};