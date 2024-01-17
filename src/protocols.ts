import { Game, Participant } from "@prisma/client";

export type ParticipantInputBody = Omit<Participant, "id" | "createdAt" | "updatedAt">;

export type GameInputBody = Omit<Game, "id" |"createdAt" | "updatedAt" | "homeTeamScore" | "awayTeamScore" | "isFinished">;