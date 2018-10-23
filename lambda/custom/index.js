// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// core functionality for fact skill
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    // gets a random fact by assigning an array to the variable
    // the random item from the array will be selected by the i18next library
    // the i18next library is set up in the Request Interceptor
    const randomFact = requestAttributes.t('FACTS');
    // concatenates a standard message with the random fact
    const speakOutput = requestAttributes.t('GET_FACT_MESSAGE') + randomFact;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
  //              This handler will not be triggered except in those locales, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

// translations
const deData = {
  translation: {
      SKILL_NAME: 'Lübecker Fakten',
    GET_FACT_MESSAGE: 'Hier ist dein Fakt: ',
    HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über Lübeck“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
    HELP_REPROMPT: 'Wie kann ich dir helfen?',
    FALLBACK_MESSAGE: 'Der Lübecker Fakten Skill kann dir dabei nicht helfen. Er kann dir Fakten über Lübeck erzählen, wenn du dannach fragst.',
    FALLBACK_REPROMPT: 'Wie kann ich dir helfen?',
    ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten.',
    STOP_MESSAGE: 'Auf Wiedersehen!',
    FACTS: 
     "types": [
        {
          "name": "facts",
          "values": [
            {
              "name": {
                "value": "Lübeck ist Erfinder des Lübecker Marzipan von Niederegger "
              }
            },
            {
              "name": {
                "value": "aus Lübeck kommen die Lübecker Hütchen auch bekannt als Leitkegel."
              }
            },
            {
              "name": {
                "value": "erst seit Herbst 2008 ist der Lübecker Hauptbahnhof an das elektrische Streckennetz angebunden."
              }
            },
            {
              "name": {
                "value": "Das Lübecker Wappen stammt aus dem Jahre 14 150 und ist damit das älteste Stadtwappen Schleswig Holsteins"
              }
            },
            {
              "name": {
                "value": "mit 42 Prozent ist evangelisch die am meisten verbreitete Religion in Lübeck "
              }
            },
            {
              "name": {
                "value": "fast die hälfte der Einwohner in Lübeck haben keine Religion"
              }
            },
            {
              "name": {
                "value": "Im Jahre 19 111 überschritt die Einwohnerzahl die Grenze von 100000, wodurch Lübeck zur Grossstadt wurde"
              }
            },
            {
              "name": {
                "value": "11 138 wurde Lübeck vollkommen zerstört und wurde an der heutigen Lage wieder auf gebaut"
              }
            },
            {
              "name": {
                "value": "Lübeck wurde 819 von den Slawen gegründet und hieß damals Liubice"
              }
            },
            {
              "name": {
                "value": "Seit neunzehnhundertsiebenundachtzig gehört Lübeck zum UNESCO weltkulturerbe"
              }
            },
            {
              "name": {
                "value": "Lübeck erbreitet sich auf einer Fläche von 214 Quadratkilometer"
              }
            },
            {
              "name": {
                "value": "Lübeck hat aktuell 216000 Einwohner"
              }
            }
          ]
        }
      ]
  },
};

const dedeData = {
  translation: {
    SKILL_NAME: 'Lübecker Fakten',
  },
};

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  'de': deData,
  'de-DE': dedeData,

};
