import { generateUrl } from './utils';

describe('api utils', () => {
  describe('generateUrl', () => {
    const baseUrl  = 'http://www.example.com';
    const endpoint = 'examples';

    it('generates the url', () => {
      const expected = `${baseUrl}/${endpoint}`;

      expect(generateUrl({ baseUrl, endpoint })).toEqual(expected);
    });

    describe('with query parameters', () => {
      const queryParameters = {
        limit: 10,
        offset: 20,
        sort: 'asc',
      };
      const expectedParams = 'limit=10&offset=20&sort=asc';

      it('generates the url with query parameters', () => {
        const expected = `${baseUrl}/${endpoint}?${expectedParams}`;

        expect(
          generateUrl({ baseUrl, endpoint, queryParameters })
        ).toEqual(expected);
      });

      describe('with query parameters including undefined values', () => {
        const queryParameters = {
          limit: 10,
          offset: 20,
          sort: 'asc',
          afterDate: undefined,
        };

        it('generates the url with query parameters', () => {
          const expected = `${baseUrl}/${endpoint}?${expectedParams}`;

          expect(
            generateUrl({ baseUrl, endpoint, queryParameters })
          ).toEqual(expected);
        });
      });
    });

    describe('with extra wildcards', () => {
      const wildcards = { foo: 'bar' };

      it('throws an error', () => {
        expect(() => generateUrl({ baseUrl, endpoint, wildcards }))
          .toThrow('unknown wildcard "foo"');
      });
    });

    describe('with an endpoint with wildcards', () => {
      const endpoint = 'examples/:exampleId/details/:detailId';

      it('throws an error', () => {
        expect(() => generateUrl({ baseUrl, endpoint }))
          .toThrow('missing wildcard "exampleId"');
      });

      describe('with expected wildcards', () => {
        const wildcards = {
          detailId: 1,
          exampleId: 'test-example',
        };

        it('generates the url with wildcard values', () => {
          const applied = 'examples/test-example/details/1';
          const expected = `${baseUrl}/${applied}`;

          expect(
            generateUrl({ baseUrl, endpoint, wildcards })
          ).toEqual(expected);
        });
      });

      describe('with extra wildcards', () => {
        const wildcards = {
          detailId: 1,
          exampleId: 'test-example',
          foo: 'bar',
        };

        it('throws an error', () => {
          expect(() => generateUrl({ baseUrl, endpoint, wildcards }))
            .toThrow('unknown wildcard "foo"');
        });
      });
    });
  });
});
