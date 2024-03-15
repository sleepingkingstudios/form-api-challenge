import { generateUrl } from './utils';

const baseUrl = 'https://api.fillout.com';
const endpoint = 'v1/api/forms/:formId/submissions';

/**
 * Performs a GET request to the /:formId/submissions endpoint.
 * @param {string} apikey - The API key for the request.
 * @param {string} formId - The Form ID to request.
 * @param {Object} queryParameters - Values used to generate the URl query string.
 *   See the relevant API documentation.
 * @return {Promise} - A promise resolving to the JSON body of the response.
 * @throws Will throw an error if the request errors.
 */
export const query = async ({
  apiKey,
  formId,
  queryParameters,
}) => {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const url = generateUrl({
    baseUrl,
    endpoint,
    queryParameters,
    wildcards: { formId },
  });
  const response = await fetch(url, { headers });
  const json = await response.json();

  return json;
};
