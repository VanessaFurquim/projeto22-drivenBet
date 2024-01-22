import httpStatus from "http-status";
import { cleanDatabase } from "../helpers/cleanDatabase-helper";
import { testApi } from "../helpers/ApiConnection-helper";
import { participantsFactory } from "../factories/participants-factory";
import prisma from "@/database/databaseConnection";

beforeEach(async () => {
    await cleanDatabase();
});

const route = "/participants";

// parameters for createMockParticipant -> invalidBody: boolean, minimumBalance: boolean.

describe(`POST request on ${route}`, () => {
    it("should return status UNPROCESSABLE_ENTITY (code 422) when body has invalid format.", async () => {
        const participant = participantsFactory.createMockParticipant(true, true);
        const response = await testApi.post(route).send(participant);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
  
    it("should return status CONFLICT (code 409) when body is valid, but participant's balance is lower than minimum of R$10,00.", async () => {
        const participant = participantsFactory.createMockParticipant(false, false);
        const response = await testApi.post(route).send(participant);

        expect(response.status).toBe(httpStatus.CONFLICT);
        expect(response.text).toEqual("Insuficient funds! You must have a balance of at least R$10,00 to continue.");
    });
  
    it("should return status CREATED (code 201) and return participant when body is valid and participant has minimum balance of R$10,00.", async () => {
        const participant = participantsFactory.createMockParticipant(false, true);
        const response = await testApi.post(route).send(participant);

        const databaseConfirmation = await prisma.participant.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            name: expect.any(String),
            balance: expect.any(Number)
        }));
        expect(databaseConfirmation).not.toBe(null || undefined);
    });
});

describe(`GET request on ${route}`, () => {
    it("should return status NOT_FOUND (code 404) and return an empty array when there are no participants registered.", async () => {
        const response = await testApi.get(route);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        expect(response.text).toBe("Results not found! There are no participants registered yet.");
    });
  
    it("should return status OK (code 200) and return array list of all participants or none, if no participant has been created.", async () => {
        await participantsFactory.addMockParticipant();
        await participantsFactory.addMockParticipant();
        await participantsFactory.addMockParticipant();

        const response = await testApi.get(route);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                name: expect.any(String),
                balance: expect.any(Number)
            })
            ])
        );
    });
});