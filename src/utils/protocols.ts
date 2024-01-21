import { Bet, Participant } from "@prisma/client";

export type ParticipantInputBody = Omit<Participant, "id" | "createdAt" | "updatedAt">;

export type GameInputBody = {
    homeTeamName: string;
	awayTeamName: string;
};

export type BetInputBody = Omit<Bet, "id" |"createdAt" | "updatedAt" | "status" | "amountWon">;

export type FinalScoreInputBody = {
    homeTeamScore: number;
	awayTeamScore: number;
};

export type WinningBetsEarningsArray = {
    id: number;
    participantId: number;
    amountWon: number;
}[];