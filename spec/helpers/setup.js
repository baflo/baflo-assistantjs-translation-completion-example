require("reflect-metadata");
const ApplicationInitializer = require("../../application-initializer").ApplicationInitializer;
const AssistantSource = require("assistant-source");
const Alexa = require("assistant-alexa");

beforeEach(function() {
  // Get application initializer and initializer main variables
  this.applicationInitializer = new ApplicationInitializer();
  this.setups = this.applicationInitializer.createAndPrepareSetups();
  this.specHelper = new AssistantSource.SpecHelper(this.setups.assistantJs, this.setups.stateMachine);
  this.inversify = this.specHelper.assistantJs.container.inversifyInstance;

  // Register all platforms. For every platform you install, you want to add an entry here.
  this.platforms = {
    alexa: new Alexa.AlexaSpecHelper(this.specHelper),
  };

  // Set "current" platform to google as default
  this.platforms.current = this.platforms.google;

  // Your default spec options which are passed into this.specHelper.prepareSpec()
  this.defaultSpecOptions = {};
});