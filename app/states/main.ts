import { injectionNames, Transitionable } from "assistant-source";
import { inject, injectable } from "inversify";

import { ApplicationState } from "./application";
import { MergedSetupSet } from "../../config/handler";

/**
 * This is your MainState.
 * Every assistantJS application has to have a state called "MainState", which acts as the default state applied when the conversation starts.
 * Therefore all intent methods implemented here can be called directly from the starting point.
 */

@injectable()
export class MainState extends ApplicationState<"mainState"> {
  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: MergedSetupSet
  ) {
    super(stateSetupSet);
  }

  /**
   * The invokeGenericIntent method (GenericIntent.invoke) is your "main entrance" into your application.
   * It is called as soon as the application is launched, e. g. if user says "launch xxxxx".
   */
  public async invokeGenericIntent(machine: Transitionable) {
    const tk = this.tk<"invokeGenericIntent">();

    this.logger.info(this.tk().invokeGenericIntent.helloWorld);
    this.logger.info(tk.helloWorld);

    this.endSessionWith(this.t(tk.invokeGenericIntent.helloWorld));
  }

  /**
   * 
   */
  public async cancelGenericIntent() {
    const tk = this.tk<"cancelGenericIntent">();

    this.logger.info(tk.invokeGenericIntent.helloWorld);

    this.endSessionWith(this.t(tk.bye));
  }
}
