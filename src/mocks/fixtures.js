/** @module mocks/fixtures */

/**
 * Generates a valid API response.
 * @param {number} [pageCount] - The number of pages. Defaults to 1.
 * @param {Object[]} responses - The form responses.
 * @param {number} [totalResponses] - The total number of responses. Defaults to responses.length.
 */
export const buildResponse = ({
  pageCount = 1,
  responses,
  totalResponses,
}) => ({
  responses,
  totalResponses: totalResponses || responses.length,
  pageCount,
});

/**
 * An invalid API key when making a mock request.
 * @constant
 * @type {string}
 * @default
 */
export const invalidApiKey = '12345';

/**
 * A valid API key when making a mock request.
 * @constant
 * @type {string}
 * @default
 */
export const validApiKey = 'secret';

/**
 * An invalid form ID when making a mock request.
 * @constant
 * @type {string}
 * @default
 */
export const invalidFormId = '9RIQKbL8871s';

/**
 * A valid form ID when making a mock request.
 * @constant
 * @type {string}
 * @default
 */
export const validFormId = 'Lccc4MRj2pPy';

/**
 * Sample data for populating mock requests.
 * @constant
 * @type {Object[]}
 */
export const responses = [
  {
    questions: [
      {
        id: 'nameId',
        name: 'What is the game name?',
        type: 'ShortAnswer',
        value: 'Red',
      },
      {
        id: 'generationId',
        name: 'What is the game generation?',
        type: 'NumberInput',
        value: 1,
      },
      {
        id: 'releaseDateId',
        name: "What was the game's release date?",
        type: 'DatePicker',
        value: '1996-02-27'
      },
    ],
    calculations: [],
    urlParameters: [],
    submissionId: '40fb8d8f-fb04-44d2-9611-8cba398f45e0',
    submissionTime: '2024-01-01T00:00:00.000Z'
  },
  {
    questions: [
      {
        id: 'nameId',
        name: 'What is the game name?',
        type: 'ShortAnswer',
        value: 'Green',
      },
      {
        id: 'generationId',
        name: 'What is the game generation?',
        type: 'NumberInput',
        value: 1,
      },
      {
        id: 'releaseDateId',
        name: "What was the game's release date?",
        type: 'DatePicker',
        value: '1996-02-27'
      },
    ],
    calculations: [],
    urlParameters: [],
    submissionId: '6d657e14-cc5a-4c51-91e2-9af95bd1667c',
    submissionTime: '2024-01-02T00:00:00.000Z'
  },
  {
    questions: [
      {
        id: 'nameId',
        name: 'What is the game name?',
        type: 'ShortAnswer',
        value: 'Blue',
      },
      {
        id: 'generationId',
        name: 'What is the game generation?',
        type: 'NumberInput',
        value: 1,
      },
      {
        id: 'releaseDateId',
        name: "What was the game's release date?",
        type: 'DatePicker',
        value: '1996-10-15'
      },
    ],
    calculations: [],
    urlParameters: [],
    submissionId: '3421997a-f81e-4afe-961b-cb0e8b0389fe',
    submissionTime: '2024-01-03T00:00:00.000Z'
  },
  {
    questions: [
      {
        id: 'nameId',
        name: 'What is the game name?',
        type: 'ShortAnswer',
        value: 'Yellow',
      },
      {
        id: 'generationId',
        name: 'What is the game generation?',
        type: 'NumberInput',
        value: 1,
      },
      {
        id: 'releaseDateId',
        name: "What was the game's release date?",
        type: 'DatePicker',
        value: '1998-09-12'
      },
    ],
    calculations: [],
    urlParameters: [],
    submissionId: '3421997a-f81e-4afe-961b-cb0e8b0389fe',
    submissionTime: '2024-01-04T00:00:00.000Z'
  },
  {
    questions: [
      {
        id: 'nameId',
        name: 'What is the game name?',
        type: 'ShortAnswer',
        value: 'Gold',
      },
      {
        id: 'generationId',
        name: 'What is the game generation?',
        type: 'NumberInput',
        value: 2,
      },
      {
        id: 'releaseDateId',
        name: "What was the game's release date?",
        type: 'DatePicker',
        value: '1999-11-21'
      },
    ],
    calculations: [],
    urlParameters: [],
    submissionId: '17c7a8bb-d074-4c80-98d0-451fb0622d35',
    submissionTime: '2024-02-01T00:00:00.000Z'
  },
  {
    questions: [
      {
        id: 'nameId',
        name: 'What is the game name?',
        type: 'ShortAnswer',
        value: 'Silver',
      },
      {
        id: 'generationId',
        name: 'What is the game generation?',
        type: 'NumberInput',
        value: 2,
      },
      {
        id: 'releaseDateId',
        name: "What was the game's release date?",
        type: 'DatePicker',
        value: '1999-11-21'
      },
    ],
    calculations: [],
    urlParameters: [],
    submissionId: 'c21bb56d-94ef-4006-a697-0dddb8f4d49a',
    submissionTime: '2024-02-02T00:00:00.000Z'
  },
  {
    questions: [
      {
        id: 'nameId',
        name: 'What is the game name?',
        type: 'ShortAnswer',
        value: 'Crystal',
      },
      {
        id: 'generationId',
        name: 'What is the game generation?',
        type: 'NumberInput',
        value: 2,
      },
      {
        id: 'releaseDateId',
        name: "What was the game's release date?",
        type: 'DatePicker',
        value: '2000-10-14'
      },
    ],
    calculations: [],
    urlParameters: [],
    submissionId: '3d455eb6-0862-43ff-acf4-3f5405602153',
    submissionTime: '2024-02-03T00:00:00.000Z'
  },
];

/**
 * A mock response for an invalid API key.
 * @constant
 * @type {Object}
 */
export const invalidApiKeyResponse = {
  statusCode: 400,
  error: 'Bad Request',
  message: 'API Key invalid',
};

/**
 * A mock response for an invalid form ID.
 * @constant
 * @type {Object}
 */
export const invalidFormIdResponse = {
  statusCode: 400,
  error: 'Bad Request',
  message: `Form not found. Do you have the right URL? Form ID ${invalidFormId}`,
};

/**
 * A mock response for an valid API key and form ID.
 * @constant
 * @type {Object}
 */
export const validResponse = buildResponse({ responses });
