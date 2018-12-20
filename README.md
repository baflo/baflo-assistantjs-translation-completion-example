# ts-translation-completion-test
Built using [AssistantJS](https://github.com/webcomputing/AssistantJS)!

# Usage

1) Install this version of AssistantJS: https://github.com/webcomputing/AssistantJS/tree/feature/translation-autocompletion

2) You possibly must fix `./node_modules/assistant-source/lib/setup.js` line `90`:

   from `return platformSpecHelper.pretendIntentCalled(intentToCall, additionalExtractions, additionalRequestContext);`
   to   `return platformSpecHelper.pretendIntentCalled(intentToCall, false, additionalExtractions, additionalRequestContext);`

3) You possibly must fix `.node_modules/assistant-alexa/lib/spec-helper.js` and replace all `this.specSetup.setup` by ` this.specSetup.assistantJs`.

