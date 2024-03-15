import { getResponses } from './get-responses.js';
import {
  buildResponse,
  invalidApiKey,
  invalidApiKeyResponse,
  invalidFormId,
  invalidFormIdResponse,
  responses,
  validApiKey,
  validFormId,
  validResponse,
} from '../../mocks/fixtures.js';

const releaseDate = (response) => {
  const question =
    response
    .questions
    .find(question => question.id === 'releaseDateId');

  if (!question) { return ''; }

  return question.value.toString();
};

describe('getResponses', () => {
  const apiKey = validApiKey;
  const formId = validFormId;

  describe('with an invalid apiKey', () => {
    const apiKey = invalidApiKey;

    it('returns the error response', async () => {
      const response = await getResponses({ apiKey, formId });

      expect(response).toEqual(invalidApiKeyResponse);
    });
  });

  describe('with an invalid formId', () => {
    it('returns the error response', async () => {
      const response = await getResponses({
        apiKey,
        formId: invalidFormId,
      });

      expect(response).toEqual(invalidFormIdResponse);
    });
  });

  describe('with a valid formId', () => {
    it('returns the valid response', async () => {
      const response = await getResponses({
        apiKey,
        formId,
      });

      expect(response).toEqual(validResponse);
    });

    describe('with filters', () => {
      const filters = [
        {
          id: 'releaseDateId',
          condition: 'greater_than',
          value: '1997-01-01T00:00:00.000Z',
        },
      ];
      const filteredResponses = responses.filter(
        response => releaseDate(response) > '1997-01-01'
      );
      const expectedResponse = {
        responses: filteredResponses,
        totalResponses: filteredResponses.length,
        pageCount: 1,
      };

      it('returns the filtered response', async () => {
        const response = await getResponses({
          apiKey,
          filters,
          formId,
        });

        expect(response).toEqual(expectedResponse);
      });
    });

    describe('with query parameters', () => {
      const queryParameters = { limit: 3, offset: 2 };
      const expectedResponse = buildResponse({
        pageCount: 3,
        responses: responses.slice(2, 5),
        totalResponses: responses.length,
      });

      it('returns the filtered response', async () => {
        const response = await getResponses({
          apiKey,
          formId,
          queryParameters,
        });

        expect(response).toEqual(expectedResponse);
      });
    });

    describe('with query parameters and filters', () => {
      const filters = [
        {
          id: 'releaseDateId',
          condition: 'greater_than',
          value: '1997-01-01T00:00:00.000Z',
        },
      ];
      const queryParameters = { limit: 3, offset: 2 };
      const filteredResponses = responses.filter(
        response => releaseDate(response) > '1997-01-01'
      );
      const filteredResponse = buildResponse({
        pageCount: 2,
        responses: filteredResponses.slice(2, 5),
        totalResponses: filteredResponses.length,
      });

      it('returns the filtered response', async () => {
        const response = await getResponses({
          apiKey,
          filters,
          formId,
          queryParameters,
        });

        expect(response).toEqual(filteredResponse);
      });
    });
  });
});
