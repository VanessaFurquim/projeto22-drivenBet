import { Bet, Game, Participant } from "@prisma/client";

export type ParticipantInputBody = Omit<Participant, "id" | "createdAt" | "updatedAt">;

export type GameInputBody = Omit<Game, "id" |"createdAt" | "updatedAt" | "homeTeamScore" | "awayTeamScore" | "isFinished">;

export type BetInputBody = Omit<Bet, "id" |"createdAt" | "updatedAt" | "status" | "amountWon">;