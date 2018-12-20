import { State } from "assistant-source";
import { AlexaHandler, AlexaSpecificTypes } from "assistant-alexa";

export type Platforms = "alexa";

export type MergedAnswerTypes = AlexaSpecificTypes;
export type MergedHandler = AlexaHandler<MergedAnswerTypes>;

export type MergedSetupSet = State.SetupSet<MergedAnswerTypes, MergedHandler>
