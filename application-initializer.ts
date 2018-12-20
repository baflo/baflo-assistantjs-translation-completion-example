import { AssistantJSApplicationInitializer, AssistantJSSetup, FilterSetup, GeneratorApplication, ServerApplication, StateMachineSetup } from "assistant-source";
import componentConfiguration from "./config/components";
import { descriptor as alexaDescriptor } from "assistant-alexa";

/**
 * This is AssistantJS's main entrance into your application. With the help of this ApplicationInitializer class, you help AssistantJS
 * to initialize your application for starting the server, generating configuration files or running specs.
 *
 * Most times you will need this file to add or remove AssistantJS components. To do so, just scroll down to the initializeSetups() method
 * and add your component there.
 *
 * Another reason you might want to edit this file is if you want to implement your own behaviour on "assistant server" or "assistant generate", e. g.
 * if you want to register additional routes in the express application. To do so, change the workflow of the runServer() or runGenerator() functions below.
 */

export class ApplicationInitializer implements AssistantJSApplicationInitializer {
  /**
   * Initializes all needed setup types. This makes the initialization process, which is needed for a running production environment, reusable for specs.
   * @param localAssistantJs AssistantJS Setup object to initialize
   * @param localStateMachineSetup StateMachineSetup object to initialize
   * @param localFilterSetup FilterSetup object to initialize
   * @param addOnly If set to true, states will only be added, but not registered in the dependency injection container
   */
  public initializeSetups(localAssistantJs: AssistantJSSetup, localStateMachineSetup: StateMachineSetup, localFilterSetup: FilterSetup, addOnly = false) {
    // Register all internal components
    if (!localAssistantJs.allInternalComponentsAreRegistered()) {
      localAssistantJs.registerInternalComponents();
    }

    // Register all additional AssistantJS components - currently none
    localAssistantJs.registerComponent(alexaDescriptor);

    // Configure components
    localAssistantJs.addConfiguration(componentConfiguration);

    // Register all states and strategies
    localStateMachineSetup.registerByConvention(addOnly);

    // Register all filters
    localFilterSetup.registerByConvention(addOnly);
  }

  /** CLI INTEGRATIONS */

  /**
   * Called via cli command "assistant server" when an AssistantJS server should be started
   * @param {number} port The port to listen on
   */
  public runServer(port = 3000) {
    // Configure server to print all unhandled rejections, if not in production (= if environment var NODE_ENV is not set to "production")
    if (!(typeof process.env.NODE_ENV === "string" && process.env.NODE_ENV.toLowerCase() === "production")) {
      ApplicationInitializer.printUnhandledRejections();
    }

    // Create and prepare setup instances
    const setups = this.createAndPrepareSetups();
    setups.assistantJs.autobind();

    // Create ServerApplication instance - you might want to pass your own express instance here!
    const serverApplication = new ServerApplication(port);

    // Let's get started!
    setups.assistantJs.run(serverApplication);
    return setups.assistantJs;
  }

  /** Called via cli command "assistant generate" */
  public runGenerator() {
    ApplicationInitializer.printUnhandledRejections();

    // Create and prepare setup instances
    const setups = this.createAndPrepareSetups();
    setups.assistantJs.autobind();

    // Create ServerApplication instance - you might want to pass your own express instance here!
    const serverApplication = new GeneratorApplication(`${process.cwd()}/builds`);

    // Let's get started!
    setups.assistantJs.run(serverApplication);
    return setups.assistantJs;
  }

  /** Creates a ready-to-use AssistantJSSetup instance */
  public createAssistantJsSetup() {
    return new AssistantJSSetup();
  }

  /** Creates all relevant setup instances for preparing our AssistantJS application */
  public createAndPrepareSetups(): { assistantJs: AssistantJSSetup; stateMachine: StateMachineSetup; filter: FilterSetup } {
    // Create setup instances
    const assistantJs = this.createAssistantJsSetup();
    const setups = { assistantJs, stateMachine: new StateMachineSetup(assistantJs), filter: new FilterSetup(assistantJs) };

    // Register all descriptors
    this.initializeSetups(setups.assistantJs, setups.stateMachine, setups.filter);

    // Return all instances
    return setups;
  }

  /** HELPER METHODS */

  /**
   * Configures current node process to print all unhandledRejections to console.
   * You possibly want to set up your own behaviour here.
   */
  private static printUnhandledRejections() {
    process.on("unhandledRejection", exception => {
      if (typeof exception !== "undefined" && exception !== null) {
        // tslint:disable-next-line:no-console
        console.log(exception);
      }
    });
  }
}
