import prisma from "@/database/databaseConnection";
import { Participant } from "@prisma/client";

async function insertNew(name: string, balance: number): Promise<Participant> {
  const participant = await prisma.participant.create({
    data: {
      name,
      balance
    }
  });

  return participant;
};
  
async function selectAll(): Promise<Participant[]> {
  const participants: Participant[] = await prisma.participant.findMany();

  return participants;
};
  
export const participantsRepository = {
  insertNew,
  selectAll
};