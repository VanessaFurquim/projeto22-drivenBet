import httpStatus from "http-status";
import { cleanDatabase } from "../helpers/cleanDatabase-helper";
import { testApi } from "../helpers/ApiConnection-helper";
import prisma from "@/database/databaseConnection";
import { gamesFactory } from "../factories/games-factory";
import { BetInputBody, GameInputBody } from "@/utils/protocols";
import { faker } from "@faker-js/faker";
import { Bet, Game, Participant } from "@prisma/client";
import { participantsFactory } from "../factories/participants-factory";
import { betsFactory } from "../factories/bets-factory";

beforeEach(async () => {
    await cleanDatabase();
});

const route = "/games";

const minimumBetAmount: number = 1;
const houseRakeTest: number = 0.3;

describe(`POST request on ${route}`, () => {
    it("should return status UNPROCESSABLE_ENTITY (code 422) when body has invalid format.", async () => {
        const mockInvalidGameBody =  {
            homeTeamName: faker.location.state() + " " + faker.animal.type() +"s",
        };
        const response = await testApi.post(route).send(mockInvalidGameBody);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("should return status CREATED (code 201) when body is valid.", async () => {
        const game: GameInputBody = gamesFactory.createMockGame();

        const response = await testApi.post(route).send(game);

        const databaseConfirmation = await prisma.game.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamName: expect.any(String),
            awayTeamName: expect.any(String),
            homeTeamScore: 0,
            awayTeamScore: 0,
            isFinished: false
        }));
        expect(databaseConfirmation).not.toBe(null || undefined);
    });
});

describe(`GET request on ${route}`, () => {
    it("should return status NOT_FOUND (code 404) and return an empty array when there are no games registered.", async () => {
        const response = await testApi.get(route);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        expect(response.text).toBe("Results not found! There are no games registered yet.");
    });
  
    it("should return status OK (code 200) and return array with all games.", async () => {
        await gamesFactory.addMockGame(false);
        await gamesFactory.addMockGame(false);
        await gamesFactory.addMockGame(false);

        const response = await testApi.get(route);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamName: expect.any(String),
                awayTeamName: expect.any(String),
                homeTeamScore: 0,
                awayTeamScore: 0,
                isFinished: false
            })
        ]));
    });
});

describe(`GET request on ${route}/:id`, () => {
    // it("should return status CONFLICT (code 409) when gameId is not sent.", async () => {
    // HOW NOT TO SEND THE GAMEID VIA URL AS A PARAMETER ?
    //     const response = await testApi.get(route);

    //     expect(response.status).toBe(httpStatus.CONFLICT);
    // });

    it("should return status NOT_FOUND (code 404) when body is valid, but game ID was not found in the database.", async () => {
        const game: Game = await gamesFactory.addMockGame(false);

        const response = await testApi.get(`${route}/${game.id + 1}`);

        const databaseConfirmation = await prisma.bet.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        expect(response.text).toBe(`Game not found! No register found under this ID: ${game.id + 1}.`);
        expect(response.body).toEqual({});
        expect(databaseConfirmation).toBe(null);
    });
  
    it("should return status OK (code 200) and return array with all games.", async () => {
        await gamesFactory.addMockGame(false);
        await gamesFactory.addMockGame(false);
        await gamesFactory.addMockGame(false);

        const response = await testApi.get(route);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamName: expect.any(String),
                awayTeamName: expect.any(String),
                homeTeamScore: 0,
                awayTeamScore: 0,
                isFinished: false
            })
        ]));
    });
});

describe(`POST request on ${route}/:id/finish`, () => {
    it("should return corresponding winning and losing statuses and updated respective participants' balances.", async () => {
        const game: Game = await gamesFactory.addMockGame(false);

        const winningParticipant: Participant = await participantsFactory.addMockParticipant();
        const amountWinningBet: number = faker.number.int({ min: minimumBetAmount, max: winningParticipant.balance });
        const winningBetInputBody: BetInputBody = betsFactory.createBet(amountWinningBet, game.id, winningParticipant.id);

        const losingParticipant: Participant = await participantsFactory.addMockParticipant();
        const amountLosingBet: number = faker.number.int({ min: minimumBetAmount, max: losingParticipant.balance });
        const losingBetInputBody: BetInputBody = betsFactory.createBet(amountLosingBet, game.id, winningParticipant.id);

        const winningBet: Bet = await betsFactory.addBet(amountWinningBet, game.id, winningParticipant.id);
        const losingBet: Bet = await betsFactory.addBet(amountLosingBet, game.id, losingParticipant.id);

        const mockBets: Bet[] = await gamesFactory.getBetsByGameId(winningBet.gameId);

        const response = await testApi.post(`${route}/${game.id}/finish`).send({
            homeTeamScore: winningBet.homeTeamScore,
            awayTeamScore: winningBet.awayTeamScore
        });

        const databaseConfirmationGame = await prisma.game.findFirst({ where: { id: response.body.id } });
        const databaseConfirmationWinningBet = await prisma.bet.findFirst({ where: { id: mockBets[0].id } });
        const databaseConfirmationLosingBet = await prisma.bet.findFirst({ where: { id: mockBets[1].id } });

        const amountWonTest: number = Math.floor((winningBet.amountBet + losingBet.amountBet) * (1 - houseRakeTest));

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamName: game.homeTeamName,
            awayTeamName: game.awayTeamName,
            homeTeamScore: expect.any(Number),
            awayTeamScore: expect.any(Number),
            isFinished: true
        }));
        expect(databaseConfirmationGame).not.toBe(null || undefined);
        expect(databaseConfirmationLosingBet.status).toBe("LOST");
        expect(databaseConfirmationLosingBet.amountWon).toBe(0);
        expect(databaseConfirmationWinningBet.status).toBe("WON");
        expect(databaseConfirmationWinningBet.amountWon).toBe(amountWonTest);

    });

    it("should return status OK (code 200) when body is valid and updates game and its bets.", async () => {
        const game: Game = await gamesFactory.addMockGame(false);

        const mockFinalHomeTeamScore: number = faker.number.int({min: 0, max: 5});
        const mockFinalAwayTeamScore: number = faker.number.int({min: 0, max: 5});

        const participant1: Participant = await participantsFactory.addMockParticipant();
        const amountBet1: number = faker.number.int({ min: minimumBetAmount, max: participant1.balance });
        const bet1: BetInputBody = betsFactory.createBet(amountBet1, game.id, participant1.id);

        const participant2: Participant = await participantsFactory.addMockParticipant();
        const amountBet2: number = faker.number.int({ min: minimumBetAmount, max: participant2.balance });
        const bet2: BetInputBody = betsFactory.createBet(amountBet2, game.id, participant2.id);

        const mockBets: Bet[] = await gamesFactory.getBetsByGameId(game.id);

        const response = await testApi.post(`${route}/${game.id}/finish`).send({
            homeTeamScore: mockFinalHomeTeamScore,
            awayTeamScore: mockFinalAwayTeamScore
          });

        const databaseConfirmation = await prisma.game.findFirst({ where: { id: response.body.id } });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamName: game.homeTeamName,
            awayTeamName: game.awayTeamName,
            homeTeamScore: expect.any(Number),
            awayTeamScore: expect.any(Number),
            isFinished: true
        }));
        expect(databaseConfirmation).not.toBe(null || undefined);
    });
});