import { BaseState } from "assistant-source";
import { injectable, unmanaged } from "inversify";
import {
  MergedSetupSet,
  MergedAnswerTypes,
  MergedHandler,
  Platforms
} from "../../config/handler";
import AutocompletionTranslations from "../../config/autocompletes/translation";

@injectable()
export class ApplicationState<
  StateName extends keyof AutocompletionTranslations = never
> extends BaseState<
  MergedAnswerTypes,
  MergedHandler,
  Platforms,
  AutocompletionTranslations,
  StateName
> {
  constructor(@unmanaged() setupSet: MergedSetupSet) {
    super(setupSet);
  }
}
