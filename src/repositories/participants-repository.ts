import prisma from "@/database/databaseConnection";

async function insertNew(name: string, balance: number) {
  const participant = await prisma.participant.create({
    data: {
      name,
      balance
    }
  });

  return participant;
};
  
async function selectAll() {
  const participants = await prisma.participant.findMany();

  return participants;
};
  
export const participantsRepository = {
  insertNew,
  selectAll
};