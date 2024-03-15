import { filterResponses } from './filter-responses.js';
import { responses } from '../mocks/fixtures.js';

const generation = (response) => {
  const question =
    response
    .questions
    .find((question) => question.id === 'generationId');

  if (!question) { return 0; }

  if (typeof question.value !== 'number') {
    return parseInt(question.value);
  }

  return question.value;
};

const releaseDate = (response) => {
  const question =
    response
    .questions
    .find((question) => question.id === 'releaseDateId');

  if (!question) { return ''; }

  return question.value.toString();
};

describe('filterResponses', () => {
  describe('with empty responses', () => {
    const filters = [
      {
        id: 'generationId',
        condition: 'equals',
        value: 1,
      },
    ];
    const responses = [];

    it('returns an empty array', () => {
      expect(filterResponses({ filters, responses })).toEqual([]);
    });
  });

  describe('with empty filters', () => {
    const filters = [];

    it('returns the unfiltered responses', () => {
      expect(filterResponses({ filters, responses })).toEqual(responses);
    });
  });

  describe('with an equals filter', () => {
    const filters = [
      {
        id: 'generationId',
        condition: 'equals',
        value: 1,
      },
    ];
    const expected = responses.filter(response => generation(response) === 1);

    it('returns the filtered responses', () => {
      expect(filterResponses({ filters, responses })).toEqual(expected);
    });
  });

  describe('with a does not equal filter', () => {
    const filters = [
      {
        id: 'generationId',
        condition: 'does_not_equal',
        value: 1,
      },
    ];
    const expected = responses.filter(response => generation(response) !== 1);

    it('returns the filtered responses', () => {
      expect(filterResponses({ filters, responses })).toEqual(expected);
    });
  });

  describe('with a less than filter', () => {
    const filters = [
      {
        id: 'releaseDateId',
        condition: 'less_than',
        value: '1997-01-01',
      },
    ];
    const expected = responses.filter(
      response => releaseDate(response) < '1997-01-01'
    );

    it('returns the filtered responses', () => {
      expect(filterResponses({ filters, responses })).toEqual(expected);
    });
  });


  describe('with a greater than filter', () => {
    const filters = [
      {
        id: 'releaseDateId',
        condition: 'greater_than',
        value: '1997-01-01',
      },
    ];
    const expected = responses.filter(
      response => releaseDate(response) > '1997-01-01'
    );

    it('returns the filtered responses', () => {
      expect(filterResponses({ filters, responses })).toEqual(expected);
    });
  });

  describe('when there are no questions matching the filter', () => {
    const filters = [
      {
        id: 'copiesSoldId',
        condition: 'greater_than',
        value: 1000000,
      },
    ];

    it('returns an empty array', () => {
      expect(filterResponses({ filters, responses })).toEqual([]);
    });
  });

  describe('with multiple filters', () => {
    const filters = [
      {
        id: 'generationId',
        condition: 'equals',
        value: 1,
      },
      {
        id: 'releaseDateId',
        condition: 'greater_than',
        value: '1997-01-01',
      },
    ];
    const expected =
      responses
      .filter(response => releaseDate(response) > '1997-01-01')
      .filter(response => generation(response) === 1);

    it('returns the filtered responses', () => {
      expect(filterResponses({ filters, responses })).toEqual(expected);
    });
  });
});
