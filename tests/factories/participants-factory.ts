import { ParticipantInputBody } from "@/utils/protocols";
import { faker } from "@faker-js/faker";
import prisma from "@/database/databaseConnection";

function createMockParticipant(invalidBody: boolean, minimumBalance: boolean) {

    if (invalidBody !== true) {
        const mockParticipantInputBody: ParticipantInputBody = {
            name: (faker.person.firstName()),
            balance: (minimumBalance === true ? faker.number.int({ min: 1000, max: 100000 }) : faker.number.int({ min: 0, max: 999 }))
        };

        return mockParticipantInputBody;

    } else {
        const mockParticipantInvalidBody = {
            name: faker.person.firstName()
        };

        return mockParticipantInvalidBody;
    }
};

async function addMockParticipant() {
    const participant = createMockParticipant(false, true);

    return await prisma.participant.create({
        data: {
            name: participant.name,
            balance: faker.number.int({ min: 1000, max: 100000 })
        }
    });
};

export const participantsFactory = {
    createMockParticipant,
    addMockParticipant
};