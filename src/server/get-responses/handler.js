/** @module server/get-responses */

import { getResponses } from './get-responses.js';

class FiltersError extends Error {
  constructor(message, filters) {
    super(message);

    this.filters = filters;
  }
}

const parseBooleanParameter = (query, parameterName) => {
  if (!(parameterName in query)) { return undefined; }

  const value = query[parameterName];

  if (!(typeof value =='string')) { return undefined; }

  return value === 'true';
};

const parseNumberParameter = (query, parameterName) => {
  if (!(parameterName in query)) { return undefined; }

  const value = query[parameterName];

  if (!(typeof value =='string')) { return undefined; }

  return parseInt(value);
};

const parseStringParameter = (query, parameterName) => {
  if (!(parameterName in query)) { return undefined; }

  const value = query[parameterName];

  if (!(typeof value =='string')) { return undefined; }

  return value;
};

const extractFilters = (query) => {
  if (!('filters' in query)) { return []; }

  let decoded;

  try {
    decoded = decodeURIComponent(query.filters);

    return JSON.parse(decoded);

    return parsed;
  } catch (error) {
    throw new FiltersError('Unable to parse JSON', decoded);
  }
};

const extractQueryParameters = (query) => {
  const params = {
    limit: parseNumberParameter(query, 'limit'),
    afterDate: parseStringParameter(query, 'afterDate'),
    beforeDate: parseStringParameter(query, 'beforeDate'),
    offset: parseNumberParameter(query, 'offset'),
    status: parseStringParameter(query, 'status'),
    includeEditLink: parseBooleanParameter(query, 'includeEditLink'),
    sort: parseStringParameter(query, 'sort'),
  };

  return Object.fromEntries(
    Object
    .entries(params)
    .filter(([key, value]) => value !== undefined)
  );
};

const validateFilters = (filters) => {
  if (!Array.isArray(filters)) {
    throw new FiltersError('Filters must be an array', JSON.stringify(filters));
  }

  filters.forEach((filter) => {
    if (!(typeof filter === 'object')) {
      throw new FiltersError('Filter item must be an object', JSON.stringify(filters));
    }

    if (!('id' in filter)) {
      throw new FiltersError('Filter item must have key "id"', JSON.stringify(filters));
    }

    if (!('condition' in filter)) {
      throw new FiltersError('Filter item must have key "condition"', JSON.stringify(filters));
    }

    if (!('value' in filter)) {
      throw new FiltersError('Filter item must have key "value"', JSON.stringify(filters));
    }
  });
};

/**
 * Express callback for handling a GetResponses request.
 */
export const handler = (req, res) => {
  const apiKey = process.env.API_KEY;
  const formId = req.params.formId;
  const queryParameters = extractQueryParameters(req.query);
  let filters;

  res.header('Content-Type', 'application/json');

  try {
    filters = extractFilters(req.query);

    validateFilters(filters);
  } catch(error) {
    if (!(error instanceof FiltersError)) {
      throw error;
    }

    res.json({
      statusCode: 400,
      error: 'Invalid Filters',
      message: `${error.message} - "${error.filters}"`,
    });

    return Promise.resolve();
  }

  return getResponses({ apiKey, filters, formId, queryParameters })
    .then((response) => { res.json(response) });
};
