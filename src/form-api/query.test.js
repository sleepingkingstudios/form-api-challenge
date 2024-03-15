import { query } from './query';

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
} from '../mocks/fixtures';

describe('query', () => {
  const apiKey = validApiKey;
  const formId = validFormId;

  describe('with an invalid apiKey', () => {
    const apiKey = invalidApiKey;

    it('returns an error response', async () => {
      const response = await query({ apiKey, formId });

      expect(response).toEqual(invalidApiKeyResponse);
    });
  });

  describe('with an invalid formId', () => {
    const formId = invalidFormId;

    it('returns an error response', async () => {
      const response = await query({ apiKey, formId });

      expect(response).toEqual(invalidFormIdResponse);
    });
  });

  describe('with an valid formId', () => {
    it('returns the response', async () => {
      const response = await query({ apiKey, formId });

      expect(response).toEqual(validResponse);
    });

    describe('with request parameters', () => {
      const queryParameters = { beforeDate: '2024-02-02T12:00:00.000Z' };
      const filteredResponses = responses.filter(
        response => response.submissionTime < '2024-02-02T12:00:00.000Z'
      );
      const expectedResponse = buildResponse({
        responses: filteredResponses,
      });

      it('returns the response', async () => {
        const response = await query({ apiKey, formId, queryParameters });

        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
