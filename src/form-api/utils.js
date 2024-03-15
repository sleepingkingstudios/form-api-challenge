/** @module form-api */

const applyWildcards = ({ url, wildcards = {} }) => {
  let expected =
    url.split('/').filter(s => s[0] === ':').map(s => s.slice(1));
  let applied = url;

  Object
    .entries(wildcards)
    .forEach(([wildcard, value]) => {
      if (expected.indexOf(wildcard) === -1) {
        throw new Error(`unknown wildcard "${wildcard}"`)
      }

      applied = applied.replace(
        new RegExp(`:${wildcard}`, 'g'),
        value.toString()
      );
      expected = expected.filter(item => item !== wildcard);
    });

  if (expected.length !== 0) {
    throw new Error(`missing wildcard "${expected[0]}"`)
  }

  return applied;
};

const extractWildcards = ({ url }) => (
  url.split('/').filter(s => s[0] === ':').map(s => s.slice(1))
);

const mergeQueryParameters = ({ queryParameters }) => {
  if (!queryParameters) { return ''; }

  const merged =
    Object
    .entries(queryParameters)
    .filter(([parameter, value]) => value !== undefined)
    .map(
      ([parameter, value]) => encodeURI(`${parameter}=${value}`)
    )
    .join('&')

  return `?${merged}`;
};

/**
 * Generates a url with wildcard values and query parameters.
 * @param {string} baseUrl - The base url for the API, e.g. 'http://www.example.com'.
 * @param {string} endpoint - The relative url for the API, e.g. '/resources/:resourceId'.
 *    Can include wildcard values (prefixed with a colon ":").
 * @param {Object} [queryParameters] - Values used to generate the URl query string.
 * @param {Object} [wildcards] - Values used to populate the endpoint wildcards.
 * @returns {string} The generated url.
 * @throws Will throw an error if there are missing wildcards in endpoint that are not present in wildcards.
 * @throws Will throw an error if there are extra wildcards in wildcards that are not present in endpoint.
 */
export const generateUrl = ({
  baseUrl,
  endpoint,
  queryParameters,
  wildcards,
}) => {
  const scopedEndpoint = endpoint[0] == '/' ? endpoint : `/${endpoint}`;
  const params = mergeQueryParameters({ queryParameters });
  const url = `${baseUrl}${scopedEndpoint}${params}`;

  return applyWildcards({ url, wildcards });
};
