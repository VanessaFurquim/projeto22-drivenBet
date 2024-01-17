import { balanceError } from "@/errors/balance-error";
import { participantsRepository } from "@/repositories/participants-repository";
import { Participant } from "@prisma/client";

async function createNew(name: string, balance: number) {
    if (balance < 1000) throw balanceError();

    const participant: Participant = await participantsRepository.insertNew(name, balance);

    return participant;
};

async function listAll() {

    const participants: Participant[] = await participantsRepository.selectAll();

    return participants;
};

export const participantsService = {
    createNew,
    listAll
};