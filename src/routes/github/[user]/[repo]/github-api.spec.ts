import { describe, it, vi } from 'vitest';
import { Fetch, GithubApi } from './githubApi';

describe('github-api', () => {
  describe('getRepository', () => {
    it("should return the repository info from GitHub's API", async ({
      expect,
    }) => {
      const fetchMock = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(
        mockPromise
      );
      const api = new GithubApi('TOKEN', fetchMock);
      // here we need to git red of await so we get the actual response promise
      const responsePromise = api.getRepository('USERNAME', 'REPO');

      // verifying that the method it called in correct way inside that getRepository method
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.github.com/repos/USERNAME/REPO`,
        {
          headers: {
            'User-Agent': 'Qwik Workshop',
            'X-GitHub-Api-Version': '2022-11-28',
            Authorization: 'Bearer TOKEN',
          },
        }
      );

      // accessing the returned value from the first call
      console.log(fetchMock.mock.results[0].value);

      // here we are mocking resolving the response promise with specific value
      const firstCallResult = fetchMock.mock.results[0];
      const returnedPromise = firstCallResult.value;
      returnedPromise.resolve(new Response('"RESPONSE"'));

      expect(await responsePromise).toEqual('RESPONSE');
    });
  });
});

// First, define our ControllablePromise type
type ControllablePromise<T> = Promise<T> & {
  resolve: (value: T) => void;
  reject: (error: any) => void;
};

// The mockPromise function stays the same as in your code
function mockPromise<T>() {
  let resolve: (value: T) => void;
  let reject: (error: string) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  }) as ControllablePromise<T>;

  promise.resolve = resolve!;
  promise.reject = reject!;
  return promise;
}
