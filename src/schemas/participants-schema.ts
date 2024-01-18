import { ParticipantInputBody } from "@/utils/protocols";
import joi from "joi";

export const participantInputSchema = joi.object<ParticipantInputBody>({
  name: joi.string().required(),
  balance: joi.number().required()
});