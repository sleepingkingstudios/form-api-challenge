import { jest } from '@jest/globals';

import { aggregateQuery } from './aggregate.js';
import { query } from './query.js';
import {
  invalidFormId,
  invalidFormIdResponse,
  responses,
  validApiKey,
  validFormId,
  validResponse,
} from '../mocks/fixtures.js';

const getOffset = (queryParameters) => {
  if (!queryParameters) { return 0; }

  const { offset } = queryParameters;

  if (!offset) { return 0; }

  return offset;
};

describe('aggregateQuery', () => {
  const apiKey = validApiKey;
  const formId = validFormId;

  describe('when the query returns an error response', () => {
    const formId = invalidFormId;

    it('performs the query', async () => {
      const spy = jest.fn(query);

      await aggregateQuery({ apiKey, formId, query: spy });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        apiKey,
        formId,
        queryParameters: { limit: 150, offset: 0 },
      });
    });

    it('returns the error response', async () => {
      const response = await aggregateQuery({ apiKey, formId, query });

      expect(response).toEqual(invalidFormIdResponse);
    });
  });

  describe('when the query returns a valid response with one page', () => {
    it('performs the query', async () => {
      const spy = jest.fn(query);

      await aggregateQuery({ apiKey, formId, query: spy });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        apiKey,
        formId,
        queryParameters: { limit: 150, offset: 0 },
      });
    });

    it('returns the valid response', async () => {
      const response = await aggregateQuery({ apiKey, formId, query });

      expect(response).toEqual(validResponse);
    });
  });

  describe('when the query returns a valid response with multiple pages', () => {
    const query = async ({ apiKey, formId, queryParameters }) => {
      const mapped = getOffset(queryParameters) / 50;
      const partialResponses = responses.slice(mapped, 3 + mapped);
      const response = {
        responses: partialResponses,
        totalResponses: responses.length,
        pageCount: 3,
      };

      return Promise.resolve(response);
    };
    const expectedResponse = {
      responses,
      totalResponses: responses.length,
      pageCount: 3,
    };

    it('performs the query once per page', async () => {
      const spy = jest.fn(query);

      await aggregateQuery({ apiKey, formId, query: spy });

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, {
        apiKey,
        formId,
        queryParameters: { limit: 150, offset: 0 }
      });
      expect(spy).toHaveBeenNthCalledWith(2, {
        apiKey,
        formId,
        queryParameters: { limit: 150, offset: 150 }
      });
      expect(spy).toHaveBeenNthCalledWith(3, {
        apiKey,
        formId,
        queryParameters: { limit: 150, offset: 300 }
      });
    });

    it('aggregates the responses', async () => {
      const response = await aggregateQuery({ apiKey, formId, query });

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('with query parameters', () => {
    const queryParameters = {
      limit: 10,
      offset: 50,
      beforeDate: '2024-01-15T00:00:00.000Z',
    };
    const filteredResponses = responses.filter(
      response => response.submissionTime < '2024-01-15T00:00:00.000Z',
    );
    const expectedResponse = {
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: 1,
    };

    describe('when the query returns a valid response with one page', () => {
      it('performs the query', async () => {
        const spy = jest.fn(query);

        await aggregateQuery({ apiKey, formId, query: spy, queryParameters });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({
          apiKey,
          formId,
          queryParameters: {
            limit: 150,
            offset: 0,
            beforeDate: '2024-01-15T00:00:00.000Z',
          },
        });
      });

      it('returns the valid response', async () => {
        const response = await aggregateQuery({ apiKey, formId, query, queryParameters });

        expect(response).toEqual(expectedResponse);
      });
    });

    describe('when the query returns a valid response with multiple pages', () => {
      const query = async ({ apiKey, formId, queryParameters }) => {
        const mapped = getOffset(queryParameters) / 50;
        const partialResponses = filteredResponses.slice(mapped, 3 + mapped);
        const response = {
          responses: partialResponses,
          totalResponses: filteredResponses.length,
          pageCount: 2,
        };

        return Promise.resolve(response);
      };
      const expectedResponse = {
        responses: filteredResponses,
        totalResponses: filteredResponses.length,
        pageCount: 2,
      };

      it('performs the query once per page', async () => {
        const spy = jest.fn(query);

        await aggregateQuery({ apiKey, formId, query: spy, queryParameters });

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(
          1,
          {
            apiKey,
            formId,
            queryParameters: {
              limit: 150,
              offset: 0,
              beforeDate: '2024-01-15T00:00:00.000Z',
            },
          }
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          {
            apiKey,
            formId,
            queryParameters: {
              limit: 150,
              offset: 150,
              beforeDate: '2024-01-15T00:00:00.000Z',
            },
          }
        );
      });

      it('aggregates the responses', async () => {
        const response = await aggregateQuery({ apiKey, formId, query, queryParameters });

        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
