import { GameInputBody } from "@/protocols";
import joi from "joi";

export const gameInputSchema = joi.object<GameInputBody>({
    homeTeamName: joi.string().required(),
    awayTeamName: joi.string().required()
});