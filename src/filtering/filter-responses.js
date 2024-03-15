/** @module filtering/filter-responses */

const applyFilter = (responses, filter) => responses.filter(
  (response) => {
    const question = response.questions.find(
      question => question.id === filter.id
    );

    if (!question) { return false; }

    return filterFor(filter.condition)({
      actual: question.value,
      expected: filter.value,
    });
  }
);

const filterFor = (condition) => {
  if (condition === 'equals') {
    return equalsFilter;
  } else if (condition === 'does_not_equal') {
    return doesNotEqualFilter;
  } else if (condition === 'less_than') {
    return lessThanFilter;
  } else {
    return greaterThanFilter;
  }
};

const doesNotEqualFilter = ({ actual, expected }) => actual !== expected;

const equalsFilter = ({ actual, expected }) => actual === expected;

const greaterThanFilter = ({ actual, expected }) => actual > expected;

const lessThanFilter = ({ actual, expected }) => actual < expected;

/**
 * Filters the given responses for all values matching the given filters.
 * @param {Object[]} filters - The filters to apply.
 * @param {Object[]} responses - The responses to filter.
 * @returns {Object[]} - The matching responses.
 */
export const filterResponses = ({
  filters,
  responses,
}) => filters.reduce(applyFilter, responses);
