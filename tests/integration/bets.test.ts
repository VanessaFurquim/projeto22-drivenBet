import httpStatus from "http-status";
import { cleanDatabase } from "../helpers/cleanDatabase-helper";
import { testApi } from "../helpers/ApiConnection-helper";
import { participantsFactory } from "../factories/participants-factory";
import { gamesFactory } from "../factories/games-factory";
import { Bet, Game, Participant } from "@prisma/client";
import { betsFactory } from "../factories/bets-factory";
import { BetInputBody } from "@/utils/protocols";
import { faker } from "@faker-js/faker";
import prisma from "@/database/databaseConnection";

beforeEach(async () => {
    await cleanDatabase();
});

const route = "/bets";

const minimumBetAmount: number = 1;

describe(`POST request on ${route}`, () => {
    it("should return status UNPROCESSABLE_ENTITY (code 422) when body has invalid format.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(false);

        const mockInvalidBetBody =  {
            homeTeamScore: faker.number.int({ min: 0, max: 10 }),
            awayTeamScore: faker.number.int({ min: 0, max: 10 }),
            gameId: game.id,
            participantId: participant.id
        };

        const response = await testApi.post(route).send(mockInvalidBetBody);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("should return status NOT_FOUND (code 404) when body is valid, but game ID was not found in the database.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(false);
        const amountBet: number = faker.number.int({ min: minimumBetAmount, max: participant.balance });
        const bet: BetInputBody = betsFactory.createBet(amountBet, game.id + 1, participant.id);

        const response = await testApi.post(route).send(bet);

        const databaseConfirmation: Bet = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        expect(response.text).toBe(`Game not found! No register found under this ID: ${game.id + 1}.`);
        expect(response.body).toEqual({});
        expect(databaseConfirmation).toBe(null);
    });

    it("should return status NOT_FOUND (code 404) when body is valid, but participant ID was not found in the database.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(false);
        const amountBet: number = faker.number.int({ min: minimumBetAmount, max: participant.balance });
        const bet: BetInputBody = betsFactory.createBet(amountBet, game.id, participant.id + 1);

        const response = await testApi.post(route).send(bet);

        const databaseConfirmation = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        expect(response.text).toBe(`Participant not found! No register found under this ID: ${participant.id + 1}.`);
        expect(response.body).toEqual({});
        expect(databaseConfirmation).toBe(null);
    });

    it("should return status CONFLICT (code 409) when body is valid, but bet amount is greater than participant's current balance.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(false);
        const amountBet: number = faker.number.int({ min: participant.balance, max: participant.balance * 2});
        const bet: BetInputBody = betsFactory.createBet(amountBet, game.id, participant.id);

        const response = await testApi.post(route).send(bet);

        const databaseConfirmation = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.CONFLICT);
        expect(response.text).toBe("Insuficient funds! The bet amount you are trying to place is greater than your current balance.");
        expect(response.body).toEqual({});
        expect(databaseConfirmation).toBe(null);
    });

    it("should return status CONFLICT (code 409) when body is valid, but bet amount is a negative value.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(false);
        const amountBet: number = 0 - faker.number.int({ min: minimumBetAmount, max: participant.balance });
        const bet: BetInputBody = betsFactory.createBet(amountBet, game.id, participant.id);

        const response = await testApi.post(route).send(bet);

        const databaseConfirmation = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.CONFLICT);
        expect(response.text).toBe(`You must place a bet higher than ${amountBet} reais and cannot be a negative value.`);
        expect(response.body).toEqual({});
        expect(databaseConfirmation).toBe(null);
    });

    it("should return status CONFLICT (code 409) when body is valid, but bet amount is equal to zero.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(false);
        const amountBet: number = 0;
        const bet: BetInputBody = betsFactory.createBet(amountBet, game.id, participant.id);

        const response = await testApi.post(route).send(bet);

        const databaseConfirmation = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.CONFLICT);
        expect(response.text).toBe(`You must place a bet higher than ${amountBet} reais and cannot be a negative value.`);
        expect(response.body).toEqual({});
        expect(databaseConfirmation).toBe(null);
    });

    it("should return status CONFLICT (code 409) when body is valid, bet amount is equal to or higher than participants balance, and game IS ALREADY OVER.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(true);
        let amountBet: number = faker.number.int({ min: minimumBetAmount, max: participant.balance });
        const bet: BetInputBody = betsFactory.createBet(amountBet, game.id, participant.id);

        const response = await testApi.post(route).send(bet);

        const databaseConfirmation = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.CONFLICT);
        expect(response.text).toBe("The game you selected is already over. Choose an ongoing game to place your bet.");
        expect(response.body).toEqual({});
        expect(databaseConfirmation).toBe(null);
    });
  
    it("should return status CREATED (code 201) when body is valid, bet amount is equal to or higher than participants balance, and game is NOT OVER YET.", async () => {
        const participant: Participant = await participantsFactory.addMockParticipant();
        const game: Game = await gamesFactory.addMockGame(false);
        const amountBet: number = faker.number.int({ min: minimumBetAmount, max: participant.balance });
        const bet: BetInputBody = betsFactory.createBet(amountBet, game.id, participant.id);

        const response = await testApi.post(route).send(bet);

        const databaseConfirmation = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamScore: expect.any(Number),
            awayTeamScore: expect.any(Number),
            amountBet: expect.any(Number), 
            gameId: expect.any(Number), 
            participantId: expect.any(Number),
            status: expect.stringMatching("PENDING"), 
            amountWon: null
        }));
        expect(databaseConfirmation).not.toBe(null || undefined);
    });
});