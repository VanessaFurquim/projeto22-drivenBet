import prisma from "@/database/databaseConnection";

export async function cleanDatabase() {
    await prisma.bet.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.game.deleteMany();
};