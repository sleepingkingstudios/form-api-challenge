import { http } from 'msw';

import {
  buildResponse,
  invalidApiKeyResponse,
  invalidFormIdResponse,
  responses,
  validApiKey,
  validFormId,
} from './fixtures.js';

const applyLimitOffset = ({
  responses,
  searchParams,
}) => {
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  let filtered = responses;

  if (offset) {
    filtered = filtered.slice(parseInt(offset))
  }

  if (limit) {
    filtered = filtered.slice(0, parseInt(limit))
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

const filterResponsesBySearch = ({
  responses,
  searchParams,
}) => {
  const afterDate = searchParams.get('afterDate');
  const beforeDate = searchParams.get('beforeDate');
  let filtered = responses;

  if (afterDate) {
    filtered = filtered.filter(response => response.submissionTime < afterDate);
  }

  if (beforeDate) {
    filtered = filtered.filter(response => response.submissionTime < beforeDate);
  }

  return filtered;
};

export const handlers = [
  http.get(
    'https://api.fillout.com/v1/api/forms/:formId/submissions',
    ({ request, params }) => {
      if (request.headers.get('authorization') !== `Bearer ${validApiKey}`) {
        return HttpResponse.json(invalidApiKeyResponse);
      }

      if(params.formId !== validFormId) {
        return HttpResponse.json(invalidFormIdResponse);
      }

      const url = new URL(request.url);
      const { searchParams } = url;
      const filtered = filterResponsesBySearch({ responses, searchParams });
      const limited = applyLimitOffset({ responses: filtered, searchParams });
      const limit =
        searchParams.has('limit') ? parseInt(searchParams.get('limit') || '') : 150;
      const pageCount = calculatePageCount({
        limit,
        totalResponses: filtered.length,
      });
      const response = buildResponse({
        pageCount,
        responses: limited,
      });

      return HttpResponse.json(response);
    },
  ),
];
