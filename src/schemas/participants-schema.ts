import { BodyInputParticipant } from '@/protocols';
//import { Participant } from '@prisma/client';
import joi from 'joi';

export const inputParticipantSchema = joi.object<BodyInputParticipant>({
  name: joi.string().required(),
  balance: joi.number().required()
});