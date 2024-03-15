import { jest } from '@jest/globals';

import { handler } from './handler';
import {
  buildResponse,
  responses,
  validApiKey,
  validFormId,
  validResponse,
} from '../../mocks/fixtures.js';

const originalApiKey = process.env.API_KEY;

const releaseDate = (response) => {
  const question =
    response
    .questions
    .find(question => question.id === 'releaseDateId');

  if (!question) { return ''; }

  return question.value.toString();
};

describe('getResponses handler', () => {
  const params = { formId: validFormId };
  const query = {};
  const request = { params, query };
  const header = jest.fn();
  const json = jest.fn();
  const response = { header, json };

  beforeEach(() => {
    process.env.API_KEY = validApiKey;

    const consoleSpy = jest.spyOn(console, 'log');

    consoleSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.API_KEY = originalApiKey;
  });

  it('sets the content type header', async () => {
    await handler(request, response);

    expect(header).toHaveBeenCalledTimes(1);
    expect(header).toHaveBeenCalledWith('Content-Type', 'application/json');
  });

  it('returns a json response', async () => {
    await handler(request, response);

    expect(json).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenCalledWith(validResponse);
  });

  describe('with query parameters', () => {
    const query = { beforeDate: '2024-02-02T12:00:00.000Z' };
    const request = { params, query };
    const filteredResponses = responses.filter(
      response => response.submissionTime < '2024-02-02T12:00:00.000Z'
    );
    const expectedResponse = buildResponse({
      responses: filteredResponses,
    });

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('with unparsable filters', () => {
    const filters = '???';
    const query = { filters };
    const request = { params, query };
    const expectedResponse = {
      statusCode: 400,
      error: 'Invalid Filters',
      message: 'Unable to parse JSON - "???"',
    };

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('with invalid filters', () => {
    const filters = JSON.stringify({ ok: true });
    const query = { filters };
    const request = { params, query };
    const expectedResponse = {
      statusCode: 400,
      error: 'Invalid Filters',
      message: `Filters must be an array - "${filters}"`,
    };

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('with an invalid filter item', () => {
    const filters = JSON.stringify(['invalid']);
    const query = { filters };
    const request = { params, query };
    const expectedResponse = {
      statusCode: 400,
      error: 'Invalid Filters',
      message: `Filter item must be an object - "${filters}"`,
    };

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('with an item with missing "id"', () => {
    const filters = JSON.stringify([{ condition: 'equals', value: 1 }]);
    const query = { filters };
    const request = { params, query };
    const expectedResponse = {
      statusCode: 400,
      error: 'Invalid Filters',
      message: `Filter item must have key "id" - "${filters}"`,
    };

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('with an item with missing "condition"', () => {
    const filters = JSON.stringify([{ id: 'generationId', value: 1 }]);
    const query = { filters };
    const request = { params, query };
    const expectedResponse = {
      statusCode: 400,
      error: 'Invalid Filters',
      message: `Filter item must have key "condition" - "${filters}"`,
    };

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('with an item with missing "value"', () => {
    const filters = JSON.stringify([{ id: 'generationId', condition: 'equals' }]);
    const query = { filters };
    const request = { params, query };
    const expectedResponse = {
      statusCode: 400,
      error: 'Invalid Filters',
      message: `Filter item must have key "value" - "${filters}"`,
    };

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('with valid filters', () => {
    const filters = JSON.stringify(
      [
        {
          id: 'releaseDateId',
          condition: 'greater_than',
          value: '1997-01-01T00:00:00.000Z',
        },
      ]
    );
    const query = { filters };
    const request = { params, query };
    const filteredResponses = responses.filter(
      response => releaseDate(response) > '1997-01-01'
    );
    const expectedResponse = {
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: 1,
    };

    it('returns a json response', async () => {
      await handler(request, response);

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
