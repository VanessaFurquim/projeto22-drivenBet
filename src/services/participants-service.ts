import { insufficientBalanceError } from "@/errors/insufficientBalance-error";
import { participantsRepository } from "@/repositories/participants-repository";
import { Participant } from "@prisma/client";

async function createNew(name: string, balance: number): Promise<Participant> {
if (balance < 1000) throw insufficientBalanceError({ messageComplement: "You must have a balance of at least R$10,00 to continue." });

    const participant: Participant = await participantsRepository.insertNew(name, balance);

    return participant;
};

async function listAll(): Promise<Participant[]> {

    const participants: Participant[] = await participantsRepository.selectAll();

    return participants;
};

export const participantsService = {
    createNew,
    listAll
};