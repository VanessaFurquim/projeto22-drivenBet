import { BetInputBody } from "@/utils/protocols";
import joi from "joi";

export const betInputSchema = joi.object<BetInputBody>({ 
	"homeTeamScore": joi.number().required(),
	"awayTeamScore": joi.number().required(),
	"amountBet": joi.number().required(),
	"gameId": joi.number().required(),
	"participantId": joi.number().required()
});