/** @module server/get-responses */

import {
  aggregateQuery,
  query,
} from '../../form-api/index.js';
import { filterResponses } from '../../filtering/index.js';

const applyLimitOffset = ({
  queryParameters = {},
  responses,
}) => {
  let filtered = responses;

  if ('offset' in queryParameters) {
    filtered = filtered.slice(queryParameters.offset);
  }

  if ('limit' in queryParameters) {
    filtered = filtered.slice(0, queryParameters.limit);
  }

  return filtered;
};

const calculatePageCount = ({
  limit = 150,
  totalResponses,
}) => {
  if (totalResponses === 0) { return 1; }

  return Math.ceil(totalResponses / limit);
};

const extractLimit = (queryParameters = {}) => queryParameters.limit || 150;

/**
 * Queries and filters all responses matching the given parameters.
 * @param {string} apikey - The API key for the request.
 * @param {Object[]} [filters] - Optional filters for filtering the responses.
 * @param {string} formId - The Form ID to request.
 * @param {function} query - The query to perform.
 * @param {Object} queryParameters - Values used to generate the URl query string.
 *   See the relevant API documentation.
 * @return {Promise} - A promise resolving to the JSON body of the aggregated response.
 * @throws Will throw an error if any of the requests error.
 */
export const getResponses = async ({
  apiKey,
  filters = [],
  formId,
  queryParameters = {},
}) => {
  // If there are no filters, no aggregation is required.
  if (filters.length === 0) {
    const response = await query({ apiKey, formId, queryParameters });

    return response;
  }

  const response = await aggregateQuery({ apiKey, formId, query, queryParameters });

  // Immediately return a failing response.
  if ('error' in response) { return response; }

  const responses = response.responses;
  const filtered = filterResponses({ filters, responses });
  const limited = applyLimitOffset({
    queryParameters,
    responses: filtered,
  });
  const totalResponses = filtered.length;

  return {
    responses: limited,
    totalResponses,
    pageCount: calculatePageCount({
      limit: extractLimit(queryParameters),
      totalResponses,
    }),
  };
};
