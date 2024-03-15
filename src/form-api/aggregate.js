/** @module form-api */

/**
 * Queries for all of the form responses for a form ID matching the query params.
 *
 * If there are more than one page of results, performs additional requests to
 * collect all responses.
 * @param {string} apikey - The API key for the request.
 * @param {string} formId - The Form ID to request.
 * @param {function} query - The query to perform.
 * @param {Object} queryParameters - Values used to generate the URl query string.
 *   See the relevant API documentation.
 * @return {Promise} - A promise resolving to the JSON body of the response.
 * @throws Will throw an error if any of the requests error.
 */
export const aggregateQuery = async ({
  apiKey,
  formId,
  query,
  queryParameters = {},
}) => {
  const paginatedParameters = {
    ...queryParameters,
    limit: 150,
    offset: 0,
  };
  const initialResponse = await query({
    apiKey,
    formId,
    queryParameters: paginatedParameters,
  });

  // Return an error result immediately.
  if (!('responses' in initialResponse)) { return initialResponse; }

  const {
    responses,
    totalResponses,
    pageCount,
  } = initialResponse;

  // If the response contains all of the requested data, return it immediately.
  if (responses.length === totalResponses) { return initialResponse; }

  let allResponses = responses;

  // For each page of data after the first, make an additional request and
  // concatenate the returned responses.
  for(let i = 1; i < pageCount; ++i) {
    const offset = 150 * i;
    const nextResponse = await query({
      apiKey,
      formId,
      queryParameters: {
        ...paginatedParameters,
        offset,
      },
    });

    // Return an error result immediately.
    if (!('responses' in nextResponse)) { return nextResponse; }

    allResponses = allResponses.concat(nextResponse.responses);
  }

  return {
    responses: allResponses,
    totalResponses,
    pageCount,
  };
};
